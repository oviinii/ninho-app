// Serviço de integração com a Cakto
const CAKTO_API_URL = import.meta.env.VITE_CAKTO_API_URL || 'https://api.cakto.com.br/v1'
const CAKTO_API_KEY = import.meta.env.VITE_CAKTO_API_KEY

export const caktoService = {
  // Criar checkout para assinatura mensal
  async createMonthlyCheckout(email: string, name: string): Promise<any> {
    try {
      const response = await fetch(`${CAKTO_API_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CAKTO_API_KEY}`
        },
        body: JSON.stringify({
          customer: {
            email,
            name
          },
          items: [{
            name: 'Ninho App - Assinatura Mensal',
            price: 2990,
            quantity: 1
          }],
          success_url: `${window.location.origin}/payment/success`,
          cancel_url: `${window.location.origin}/payment/cancel`
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao criar checkout')
      }

      return response.json()
    } catch (error) {
      console.error('Erro no Cakto:', error)
      return { checkout_url: null }
    }
  },

  async getSubscription(subscriptionId: string): Promise<any> {
    try {
      const response = await fetch(`${CAKTO_API_URL}/subscriptions/${subscriptionId}`, {
        headers: {
          'Authorization': `Bearer ${CAKTO_API_KEY}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar assinatura')
      }

      return response.json()
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error)
      return null
    }
  },

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${CAKTO_API_URL}/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CAKTO_API_KEY}`
        }
      })

      return response.ok
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error)
      return false
    }
  }
}
