from datetime import datetime
from django.views.generic import ListView, TemplateView
from django.db.models import Count, Min, Sum, Avg, F, Q

from ..models import Order, Product, OrderProduct, Supplier
from ..mixins import ReportsMixin


# Sales Order Listing
class Report1(ReportsMixin, ListView):
    model = Order
    template_name = 'reports/taconite/report_1.xml'
    pdf_template = 'reports/pdf/report_1.html'
    csv_template = 'reports/csv/report_1.txt'

    pdf_name = 'report1.pdf'
    csv_name = 'report1.csv'

    def get_queryset(self):
        dfrom = self.request.GET.get('from', None)
        dto = self.request.GET.get('to', None)
        qs = super(Report1, self).get_queryset().filter(statuses__status='SD')

        if dfrom:
            dfrom = datetime.strptime(dfrom, '%d/%m/%Y')
            qs = qs.filter(order_date__gte=dfrom)

        if dto:
            dto = datetime.strptime(dto, '%d/%m/%Y')
            qs = qs.filter(order_date__lte=dto)
        return qs.order_by('-order_date')

report_1 = Report1.as_view()


# Top Sellers
class Report2(ReportsMixin, ListView):
    model = Order
    template_name = 'reports/taconite/report_2.xml'
    pdf_template = 'reports/pdf/report_2.html'
    csv_template = 'reports/csv/report_2.txt'

    pdf_name = 'report2.pdf'
    csv_name = 'report2.csv'

    def get_queryset(self):
        dfrom = self.request.GET.get('from', None)
        dto = self.request.GET.get('to', None)
        qs = super(Report2, self).get_queryset().filter(statuses__status='SD')

        if dfrom:
            dfrom = datetime.strptime(dfrom, '%d/%m/%Y')
            qs = qs.filter(order_date__gte=dfrom)

        if dto:
            dto = datetime.strptime(dto, '%d/%m/%Y')
            qs = qs.filter(order_date__lte=dto)

        return qs.values('customer__pk', 'customer__name', 'customer__customer_type').annotate(total=Sum('total_cost')).filter(total__gt=0).order_by('-total')[:100]

report_2 = Report2.as_view()


# Sent items
class Report3(Report1):
    template_name = 'reports/taconite/report_3.xml'
    pdf_template = 'reports/pdf/report_3.html'
    csv_template = 'reports/csv/report_3.txt'

    pdf_name = 'report3.pdf'
    csv_name = 'report3.csv'

report_3 = Report3.as_view()


# Minimum Stock Report
class Report4(ReportsMixin, ListView):
    model = Product
    template_name = 'reports/taconite/report_4.xml'
    pdf_template = 'reports/pdf/report_4.html'
    csv_template = 'reports/csv/report_4.txt'

    pdf_name = 'report4.pdf'
    csv_name = 'report4.csv'

    def get_queryset(self):
        return super(Report4, self).get_queryset().filter(current_stock__lt=F('minimum_stock'))

report_4 = Report4.as_view()


# Volume by Product Report
class Report5(ReportsMixin, TemplateView):
    template_name = 'reports/taconite/report_5.xml'
    pdf_template = 'reports/pdf/report_5.html'
    csv_template = 'reports/csv/report_5.txt'

    pdf_name = 'report5.pdf'
    csv_name = 'report5.csv'

    def get_context_data(self, **kwargs):
        ret = super(Report5, self).get_context_data(**kwargs)

        dfrom = self.request.GET.get('from', None)
        dto = self.request.GET.get('to', None)
        prod_ids = self.request.GET.get('product_ids', None)

        if not prod_ids:
            return ret

        prod_ids = str(prod_ids).split(',')
        prod_ids = map(int, prod_ids)

        q_filter = []
        if dfrom:
            dfrom = datetime.strptime(dfrom, '%d/%m/%Y')
            q_filter.append(Q(order__order_date__gte=dfrom))

        if dto:
            dto = datetime.strptime(dto, '%d/%m/%Y')
            q_filter.append(Q(order__order_date__lte=dto))

        products = list(Product.objects.filter(pk__in=prod_ids))
        for p in products:
            p.complete_ordered_list = []
            for order_product in p.ordered_list.filter(*q_filter):
                p.complete_ordered_list.append(order_product)

        ret.update({'report_data': products})
        return ret

report_5 = Report5.as_view()


# Product Stock Costings (stocktake)
class Report6(ReportsMixin, ListView):
    model = OrderProduct
    template_name = 'reports/taconite/report_6.xml'
    pdf_template = 'reports/pdf/report_6.html'
    csv_template = 'reports/csv/report_6.txt'

    pdf_name = 'report6.pdf'
    csv_name = 'report6.csv'

    def get_queryset(self):
        dfrom = self.request.GET.get('from', None)
        dto = self.request.GET.get('to', None)
        # TODO: consider the status of order (Canceled status)
        qs = super(Report6, self).get_queryset().select_related()

        if dfrom:
            dfrom = datetime.strptime(dfrom, '%d/%m/%Y')
            qs = qs.filter(order__order_date__gte=dfrom)

        if dto:
            dto = datetime.strptime(dto, '%d/%m/%Y')
            qs = qs.filter(order__order_date__lte=dto)
        return qs.order_by('-order__order_date', 'product__supplier__code')

report_6 = Report6.as_view()


# Royalty Summary by Type
class Report7(ReportsMixin, ListView):
    model = OrderProduct
    supplier = None

    template_name = 'reports/taconite/report_7.xml'
    pdf_template = 'reports/pdf/report_7.html'
    csv_template = 'reports/csv/report_7.txt'

    pdf_name = 'report7.pdf'
    csv_name = 'report7.csv'

    def dispatch(self, request, *args, **kwargs):
        try:
            self.supplier = Supplier.objects.get(pk=self.request.GET.get('supplier'))
        except Supplier.DoesNotExist:
            pass

        return super(Report7, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        ct = super(Report7, self).get_context_data(**kwargs)
        ct.update({'supplier': self.supplier})
        return ct

    def get_queryset(self):
        dfrom = self.request.GET.get('from', None)
        dto = self.request.GET.get('to', None)
        qs = super(Report7, self).get_queryset().select_related()

        if not self.supplier:
            return qs.none()

        qs = qs.filter(product__supplier_id=self.supplier)

        if dfrom:
            dfrom = datetime.strptime(dfrom, '%d/%m/%Y')
            qs = qs.filter(order__order_date__gte=dfrom)

        if dto:
            dto = datetime.strptime(dto, '%d/%m/%Y')
            qs = qs.filter(order__order_date__lte=dto)
        return qs.order_by('-order__order_date',)

report_7 = Report7.as_view()