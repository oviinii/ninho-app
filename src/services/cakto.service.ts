// Serviço de integração com a Cakto
const CAKTO_PAYMENT_LINK = import.meta.env.VITE_CAKTO_PAYMENT_LINK

export const caktoService = {
  // Redirecionar para o link de pagamento
  redirectToCheckout(email: string, name: string): void {
    // Salvar dados do usuário para usar depois
    sessionStorage.setItem('checkout_email', email)
    sessionStorage.setItem('checkout_name', name)

    // Redirecionar para o link de pagamento
    window.location.href = CAKTO_PAYMENT_LINK
  },

  // Verificar se o link de pagamento está configurado
  isConfigured(): boolean {
    return !!CAKTO_PAYMENT_LINK
  }
}
