
import { Product, UserRole } from '../../types';

export let mockProducts: Product[] = [
  // Omar Tech
  { id: 'p1', companyId: 'T-GADGET', userId: 'user-001', name: 'UltraFlow Pro Laptop', description: 'Next-gen silicon chip with 32GB RAM.', price: 1299, category: 'Electronics', image: 'https://picsum.photos/600/400?random=11', status: 'Approved', views: 450, sales: 25 },
  { id: 'p2', companyId: 'T-GADGET', userId: 'user-001', name: 'SonicBuds v2', description: 'Immersive sound with 50h battery.', price: 199, category: 'Electronics', image: 'https://picsum.photos/600/400?random=12', status: 'Approved', views: 890, sales: 110 },
  { id: 'p3', companyId: 'T-GADGET', userId: 'user-001', name: 'Nano Tablet Air', description: 'Thinnest tablet on the market.', price: 499, category: 'Electronics', image: 'https://picsum.photos/600/400?random=13', status: 'Pending', views: 0, sales: 0 },

  // Sara Styles
  { id: 'p4', companyId: 'T-VELVET', userId: 'user-002', name: 'Midnight Silk Scarf', description: 'Hand-woven pure silk.', price: 85, category: 'Fashion', image: 'https://picsum.photos/600/400?random=21', status: 'Approved', views: 320, sales: 45 },
  { id: 'p5', companyId: 'T-VELVET', userId: 'user-002', name: 'Sustainable Trench Coat', description: 'Eco-friendly recycled materials.', price: 210, category: 'Fashion', image: 'https://picsum.photos/600/400?random=22', status: 'Approved', views: 560, sales: 88 },
  { id: 'p6', companyId: 'T-VELVET', userId: 'user-002', name: 'Velvet Clutch Bag', description: 'Minimalist evening bag.', price: 145, category: 'Fashion', image: 'https://picsum.photos/600/400?random=23', status: 'Pending', views: 10, sales: 0 },

  // Nour Bites
  { id: 'p7', companyId: 'T-ARTISAN', userId: 'user-003', name: 'Organic Mountain Honey', description: 'Pure, raw mountain honey.', price: 35, category: 'Food', image: 'https://picsum.photos/600/400?random=31', status: 'Approved', views: 150, sales: 30 },
  { id: 'p8', companyId: 'T-ARTISAN', userId: 'user-003', name: 'Gourmet Saffron Box', description: 'Grade A Persian saffron.', price: 120, category: 'Food', image: 'https://picsum.photos/600/400?random=32', status: 'Approved', views: 95, sales: 8 },
  { id: 'p9', companyId: 'T-ARTISAN', userId: 'user-003', name: 'Dark Truffle Cookies', description: 'Rich dark chocolate cookies.', price: 15, category: 'Food', image: 'https://picsum.photos/600/400?random=33', status: 'Pending', views: 200, sales: 0 }
];

export const getProducts = async (req: any, res: any) => {
  const { role, companyId } = req.user;
  // Global admin sees all, Tenant admin/Specialist/User only see company-specific products
  const products = (role === UserRole.ADMIN && companyId === 'GLOBAL') 
    ? mockProducts 
    : mockProducts.filter(p => p.companyId === companyId);
  res.json(products);
};

export const createProduct = async (req: any, res: any) => {
  const newProduct: Product = {
    ...req.body,
    id: `p${Math.random().toString(36).substr(2, 9)}`,
    userId: req.user.id,
    companyId: req.user.companyId,
    status: 'Pending',
    views: 0,
    sales: 0,
    createdAt: new Date().toISOString()
  };
  mockProducts.push(newProduct);
  res.status(201).json(newProduct);
};

export const updateProduct = async (req: any, res: any) => {
  const { id } = req.params;
  const { role, companyId } = req.user;
  const index = mockProducts.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });
  
  // Enforce company isolation
  if (companyId !== 'GLOBAL' && mockProducts[index].companyId !== companyId) {
    return res.status(403).json({ message: 'Unauthorized access to another company\'s products' });
  }

  mockProducts[index] = { ...mockProducts[index], ...req.body };
  res.json(mockProducts[index]);
};

export const toggleProductStatus = async (req: any, res: any) => {
  const { id } = req.params;
  const { status } = req.body;
  const { role, companyId } = req.user;
  
  const index = mockProducts.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });
  
  // Only admins can toggle status, but must respect company isolation
  if (role !== UserRole.ADMIN) return res.status(403).json({ message: 'Only admins can update status' });
  if (companyId !== 'GLOBAL' && mockProducts[index].companyId !== companyId) {
    return res.status(403).json({ message: 'Unauthorized access' });
  }

  mockProducts[index].status = status;
  res.json({ message: `Status updated`, product: mockProducts[index] });
};

export const deleteProduct = async (req: any, res: any) => {
  const { id } = req.params;
  const { role, companyId } = req.user;
  const index = mockProducts.findIndex(p => p.id === id);
  
  if (index === -1) return res.status(404).json({ message: 'Product not found' });
  
  // Security check: Only owner or admin within the company can delete
  const isOwner = mockProducts[index].userId === req.user.id;
  const isAdmin = role === UserRole.ADMIN;
  const isSameCompany = mockProducts[index].companyId === companyId || companyId === 'GLOBAL';

  if (!isSameCompany || (!isOwner && !isAdmin)) {
    return res.status(403).json({ message: 'Unauthorized deletion attempt' });
  }

  mockProducts.splice(index, 1);
  res.json({ message: 'Deleted' });
};
