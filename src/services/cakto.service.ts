// Serviço de integração com a Cakto
const CAKTO_API_URL = import.meta.env.VITE_CAKTO_API_URL || 'https://api.cakto.com.br/v1'
const CAKTO_API_KEY = import.meta.env.VITE_CAKTO_API_KEY

export const caktoService = {
  // Gerar URL de checkout (redirecionamento direto)
  getCheckoutUrl(email: string, name: string): string {
    // Parâmetros para o checkout
    const params = new URLSearchParams({
      customer_email: email,
      customer_name: name,
      product_name: 'Ninho App - Assinatura Mensal',
      price: '2990',
      interval: 'month',
      success_url: `${window.location.origin}/payment/success`,
      cancel_url: `${window.location.origin}/payment/cancel`
    })

    return `${CAKTO_API_URL}/checkout?${params.toString()}`
  },

  // Criar checkout e redirecionar
  async redirectToCheckout(email: string, name: string): Promise<void> {
    try {
      // Salvar dados do usuário para depois
      sessionStorage.setItem('checkout_email', email)
      sessionStorage.setItem('checkout_name', name)

      // URL do checkout
      const checkoutUrl = this.getCheckoutUrl(email, name)
      
      // Redirecionar para o checkout
      window.location.href = checkoutUrl
    } catch (error) {
      console.error('Erro ao redirecionar para checkout:', error)
      throw error
    }
  },

  async verifyPayment(checkoutId: string): Promise<any> {
    try {
      const response = await fetch(`${CAKTO_API_URL}/checkout/${checkoutId}`, {
        headers: {
          'Authorization': `Bearer ${CAKTO_API_KEY}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao verificar pagamento')
      }

      return response.json()
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error)
      return null
    }
  }
}
