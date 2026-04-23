export function getAutoReply(message: string) {
  const text = message.toLowerCase();

  if (text.includes('price')) {
    return "Our team will send you the price shortly 💰";
  }

  if (text.includes('order')) {
    return "Please provide your order ID so we can assist you 📦";
  }

  if (text.includes('delivery')) {
    return "Delivery usually takes 2-5 business days 🚚";
  }

  return "Thank you for reaching out! 🙏 Please wait while our team responds.";
}

export function getWelcomeMessage() {
  return "Welcome! 👋 How can we assist you today?";
}