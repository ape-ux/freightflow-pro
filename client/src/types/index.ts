// FreightFlow Pro - Type Definitions

export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  role: 'admin' | 'dispatcher' | 'sales' | 'viewer';
  avatar?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}

export interface Contact {
  name: string;
  email: string;
  phone: string;
  role?: string;
}

export interface Company {
  id: string;
  name: string;
  type: 'shipper' | 'consignee' | 'broker' | 'carrier';
  mcNumber?: string;
  dotNumber?: string;
  address: Address;
  contacts: Contact[];
  creditLimit?: number;
  paymentTerms: number;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  zip: string;
  portCode?: string;
  coordinates?: { lat: number; lng: number };
  contactName?: string;
  contactPhone?: string;
}

export interface ContainerInfo {
  size: '20' | '40' | '40HC' | '45';
  type: 'Dry' | 'Reefer' | 'Tank' | 'Flatbed' | 'Open Top';
  grossWeight?: number;
  commodity?: string;
  hazmat?: boolean;
  hazmatClass?: string;
}

export interface RateComponent {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface RateBreakdown {
  baseRate: number;
  fuelSurcharge: number;
  chassisFee?: number;
  portCongestion?: number;
  tolls?: number;
  additionalCharges?: RateComponent[];
}

export interface CarrierQuote {
  carrierId: string;
  carrierName: string;
  rate: number;
  transitDays: number;
  validUntil: string;
  status: 'pending' | 'received' | 'selected' | 'declined';
  rateBreakdown?: RateBreakdown;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  origin: Location;
  destination: Location;
  containerInfo: ContainerInfo;
  serviceType: 'port_drayage' | 'transload' | 'OTR' | 'LTL';
  pickupDate: string;
  deliveryDate?: string;
  rates: RateBreakdown;
  totalRate: number;
  marginPercent: number;
  carrierQuotes: CarrierQuote[];
  selectedCarrierId?: string;
  status: 'draft' | 'pending' | 'accepted' | 'expired' | 'declined';
  validUntil: string;
  createdAt: string;
  createdBy: string;
  notes?: string;
}

export interface Stop {
  sequence: number;
  location: Location;
  type: 'pickup' | 'delivery' | 'stop';
  appointmentTime?: string;
  actualTime?: string;
}

export interface Accessorial {
  code: string;
  name: string;
  amount: number;
  billable: boolean;
}

export interface StatusUpdate {
  status: DispatchStatus;
  timestamp: string;
  location?: string;
  notes?: string;
  updatedBy: string;
}

export interface Document {
  id: string;
  type: 'rate_confirmation' | 'bol' | 'pod' | 'weight_ticket' | 'photo' | 'other';
  name: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export type DispatchStatus =
  | 'pending'
  | 'dispatched'
  | 'at_pickup'
  | 'in_transit'
  | 'at_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface Dispatch {
  id: string;
  dispatchNumber: string;
  quoteId?: string;
  customerId: string;
  customerName: string;
  carrierId: string;
  carrierName: string;
  driverId?: string;
  driverName?: string;
  containerNumber?: string;
  sealNumber?: string;
  billOfLading?: string;
  bookingNumber?: string;
  origin: Location;
  destination: Location;
  stops: Stop[];
  pickupAppointment: string;
  deliveryAppointment: string;
  actualPickup?: string;
  actualDelivery?: string;
  lastFreeDay?: string;
  carrierRate: number;
  customerRate: number;
  accessorials: Accessorial[];
  totalCost: number;
  totalRevenue: number;
  grossProfit: number;
  status: DispatchStatus;
  currentLocation?: { lat: number; lng: number; address: string };
  eta?: string;
  statusHistory: StatusUpdate[];
  documents: Document[];
  createdAt: string;
}

export interface Carrier {
  id: string;
  name: string;
  mcNumber: string;
  dotNumber?: string;
  scacCode?: string;
  serviceTypes: ('drayage' | 'OTR' | 'LTL' | 'rail')[];
  equipmentTypes: string[];
  serviceAreas: string[];
  rating: number;
  onTimePercent: number;
  insuranceExpiry: string;
  status: 'active' | 'inactive' | 'pending';
  contactInfo?: Contact;
}

export interface Driver {
  id: string;
  carrierId: string;
  carrierName: string;
  name: string;
  phone: string;
  email?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  twicNumber?: string;
  twicExpiry?: string;
  equipmentType?: string;
  currentLocation?: { lat: number; lng: number; address: string };
  status: 'available' | 'on_load' | 'off_duty';
}

export interface RateCard {
  id: string;
  carrierId: string;
  carrierName: string;
  originZone: string;
  destinationZone: string;
  containerSize: string;
  baseRate: number;
  fuelSurchargePercent: number;
  chassisFee?: number;
  portCongestionFee?: number;
  effectiveDate: string;
  expiryDate?: string;
}
