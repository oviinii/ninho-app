export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload = req.body
    console.log('📥 Webhook recebido:', JSON.stringify(payload, null, 2))

    const { event, data } = payload

    switch (event) {
      case 'payment.succeeded':
        await handlePaymentSucceeded(data)
        break
      case 'subscription.created':
        await handleSubscriptionCreated(data)
        break
      default:
        console.log('Evento não tratado:', event)
    }

    return res.status(200).json({ received: true })

  } catch (error) {
    console.error('Erro no webhook:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function handlePaymentSucceeded(data: any) {
  console.log('✅ Pagamento recebido:', data)
  
  const email = data.customer?.email || data.metadata?.checkout_email
  const name = data.customer?.name || data.metadata?.checkout_name

  if (email) {
    console.log(`📝 Pagamento confirmado para: ${email} (${name})`)
    // Aqui você pode armazenar que o usuário pagou
    // para referência futura
  }
}

async function handleSubscriptionCreated(data: any) {
  console.log('📦 Assinatura criada:', data)
}
