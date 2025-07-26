const formatCurrency = (qty: number) => {
    return new Intl.NumberFormat(
        'es-ES',
        {style: 'currency', currency: 'EUR', minimumFractionDigits: 2}
    ).format(qty)
}

export default formatCurrency