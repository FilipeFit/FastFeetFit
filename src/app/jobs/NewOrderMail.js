import Mail from '../../lib/Mail';

class NewOrderMail {
  get key() {
    return 'NewOrderMail';
  }

  async handle({ data }) {
    const { order } = data;
    // eslint-disable-next-line no-console
    console.log('A fila executou');
    await Mail.sendMail({
      to: `${order.courier.name} <${order.courier.email}>`,
      subject: 'Nova ordem de transporte',
      template: 'neworder',
      context: {
        courier: order.courier.name,
        orderId: order.id
      }
    });
  }
}

export default new NewOrderMail();
