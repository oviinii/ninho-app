import { supabase } from '@/lib/supabase'

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
  
  if (email) {
    // Verificar se usuário já existe
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (!existingUser) {
      // Se não existir, o usuário deve criar a conta manualmente
      // Mas podemos marcar que ele já pagou
      console.log('📝 Usuário com email', email, 'pagou, mas ainda não tem conta')
    } else {
      // Atualizar perfil para premium
      await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('id', existingUser.id)
    }
  }
}

async function handleSubscriptionCreated(data: any) {
  console.log('📦 Assinatura criada:', data)
  // Atualizar status da assinatura no banco
}
