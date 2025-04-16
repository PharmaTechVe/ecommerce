export const orderDetailsMap = {
  '1': {
    orderNumber: '#A1001',
    products: [
      {
        id: 'm1',
        name: 'Paracetamol 500mg',
        description: 'Analgésico y antipirético de uso general',
        price: 5.5,
        quantity: 2,
        image:
          'https://upload.wikimedia.org/wikipedia/commons/7/7f/Paracetamol_tablets.jpg',
        checked: true,
      },
      {
        id: 'm2',
        name: 'Ibuprofeno 400mg',
        description: 'Antiinflamatorio no esteroideo (AINE)',
        price: 6.99,
        quantity: 1,
        image:
          'https://upload.wikimedia.org/wikipedia/commons/3/30/Ibuprofen-tablets.jpg',
        checked: false,
      },
    ],
    subtotal: 17.99,
    discount: 2.0,
    tax: 1.44,
    total: 17.43,
  },
  '2': {
    orderNumber: '#A1002',
    products: [
      {
        id: 'm3',
        name: 'Amoxicilina 500mg',
        description: 'Antibiótico de amplio espectro',
        price: 12.0,
        quantity: 3,
        image:
          'https://upload.wikimedia.org/wikipedia/commons/3/39/Amoxicillin_capsules-1.jpg',
        checked: true,
      },
    ],
    subtotal: 36.0,
    discount: 0,
    tax: 2.88,
    total: 38.88,
  },
};
