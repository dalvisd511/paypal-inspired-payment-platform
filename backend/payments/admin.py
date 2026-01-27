from django.contrib import admin
from .models import Wallet, Transaction


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance', 'created_at')
    readonly_fields = ('created_at',)


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'amount', 'timestamp')
    readonly_fields = ('timestamp',)
