'use client';
import regions from '@/data/ph/regions.json';
import provinces from '@/data/ph/provinces.json';
import cities from '@/data/ph/cities.json';
import barangays from '@/data/ph/barangays.json';
import { MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';

export default function CheckoutPage() {
  const { user, updateUserData } = useAuth();
  const { items, clearCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddressList, setShowAddressList] = useState(false);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
const [step, setStep] = useState<'region' | 'province' | 'city' | 'barangay'>('region');

const [selectedRegion, setSelectedRegion] = useState('');
const [selectedProvince, setSelectedProvince] = useState('');
const [selectedCity, setSelectedCity] = useState('');
const [tempBarangay, setTempBarangay] = useState(''); 
const [selectedRegionName, setSelectedRegionName] = useState('');
const [selectedProvinceName, setSelectedProvinceName] = useState('');
const [selectedCityName, setSelectedCityName] = useState('');
const hasProvinces = provinces.some((p: any) => p.regionCode === selectedRegion);

  

  const [formData, setFormData] = useState({
  fullName: '',
  phone: '',
  province: '',
  city: '',
  barangay: '',
  zipCode: '',
});

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ LOAD ADDRESSES
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.uid) return;

      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);

      if (snap.exists() && snap.data().addresses) {
        const data = snap.data().addresses;

        setAddresses(data);

        const def = data.find((a: any) => a.isDefault);
        const selected = def || data[0];

        setSelectedAddress(selected);

        setFormData((prev) => ({
          ...prev,
          ...selected,
        }));
      }
    };

    fetchAddresses();
  }, [user]);

  // ✅ SAVE / EDIT ADDRESS
  const handleSaveAddress = async () => {
    if (!user) return;

    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);

    let existing: any[] = [];

    if (snap.exists() && snap.data().addresses) {
      existing = snap.data().addresses;
    }

    let updated;

    if (isEditing && editingId) {
      updated = existing.map((addr) =>
        addr.id === editingId ? { ...addr, ...formData } : addr
      );
    } else {
      const newAddress = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        phone: formData.phone,
        province: formData.province,
        city: formData.city,
        barangay: formData.barangay,
        zipCode: formData.zipCode,
        isDefault: existing.length === 0,
      };

      updated = [...existing, newAddress];
      setSelectedAddress(newAddress);
    }

    await setDoc(ref, { addresses: updated }, { merge: true });

    setAddresses(updated);
    setIsEditing(false);
    setEditingId(null);
    setShowAddressModal(false);
  };

  // ✅ PLACE ORDER
  const handleSubmit = async () => {
    if (!selectedAddress) return;

    setLoading(true);

    try {
      const order = {
        userId: user?.uid,
        items,
        shippingAddress: selectedAddress,
        status: 'Pending',
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'orders'), order);

      await updateUserData({
        address: `${selectedAddress.barangay}, ${selectedAddress.city}, ${selectedAddress.province}`,
        phone: selectedAddress.phone,
      });

      clearCart();
      router.push(`/orders/${docRef.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-4">

        <div className="mb-8">
  <h1 className="text-3xl font-bold mb-2">Checkout</h1>
  <p className="text-slate-600">
    Review your order and complete your purchase
  </p>
</div>

        {/* ================= DELIVERY ADDRESS ================= */}
        <Card className="p-5">
          <h2 className="flex items-center gap-2 font-semibold mb-3 text-[#2787b4]">

  <MapPin className="w-5 h-5" />

  Delivery Address

</h2>

          {!formData.barangay ? (
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                No address yet. Please add one.
              </p>

              <button
                onClick={() => {
  setFormData({
    fullName: '',
    phone: '',
    province: '',
    city: '',
    barangay: '',
    zipCode: '',
  });

  setIsEditing(false);
  setEditingId(null);

  setSelectedRegion('');
  setSelectedProvince('');
  setSelectedCity('');
  setTempBarangay('');
  setStep('region');

  setShowAddressModal(true);
}}
                className="text-[#2787b4] text-sm font-medium hover:underline"
              >
                Add Address
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-sm">

  {/* LEFT SIDE */}
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">

    <span className="font-semibold">
      {formData.fullName} ({formData.phone})
    </span>

    <span className="text-gray-600">
      {formData.barangay}, {formData.city}, {formData.province} {formData.zipCode}
    </span>

    <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded w-fit">
      Default
    </span>

  </div>

  {/* RIGHT SIDE */}
  <button
    onClick={() => setShowAddressList(true)}
    className="text-[#2787b4] text-sm font-medium self-start sm:self-auto"
  >
    Change
  </button>

</div>
          )}
        </Card>

        {/* ================= PRODUCTS ================= */}
        <Card className="p-5">
          <h2 className="font-bold mb-4">Products Ordered</h2>

          {items.map((item: any) => (
            <div key={item.id} className="flex gap-3 mb-3">
              <img
                src={item.image || '/placeholder.png'}
                className="w-14 h-14 object-cover border rounded"
              />

              <div className="flex-1">
                <p className="text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">{item.unit}</p>
              </div>

              <div>{item.quantity}</div>
              
              
            </div>
            
          ))}
          
        </Card>


        {/* ================= PLACE ORDER ================= */}
        {/* 🔥 BUTTONS */}
<div className="mt-6 pt-4 flex gap-3">

  {/* PLACE ORDER */}
  <Button
    onClick={handleSubmit}
    disabled={!selectedAddress || loading}
    className="flex-1 bg-[#2787b4] hover:bg-[#1f6f94] text-white"
  >
    {loading ? 'Placing Order...' : 'Place Order'}
  </Button>

  {/* BACK TO CART */}
  <Button
    onClick={() => router.push('/cart')}
    variant="outline"
    className="flex-1"
  >
    Back to Cart
  </Button>

</div>
</div>

      {/* ================= ADDRESS LIST ================= */}
      {showAddressList && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    
    <div className="bg-white w-full max-w-2xl rounded-lg p-6 relative">

      {/* ❌ CLOSE BUTTON */}
      <button
        onClick={() => setShowAddressList(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-black text-lg"
      >
        ✕
      </button>

            <h2 className="text-lg font-semibold mb-4">My Address</h2>

            {addresses.map((addr) => (
              <div key={addr.id} className="flex gap-3 border-b pb-3">

                <input
                  type="radio"
                  checked={selectedAddress?.id === addr.id}
                  onChange={() => {
                    setSelectedAddress(addr);
                    setFormData((prev) => ({ ...prev, ...addr }));
                    setShowAddressList(false);
                  }}
                />

                <div className="flex-1 flex justify-between">
                  <div>
                    <p className="font-medium">
                      {addr.fullName} ({addr.phone})
                    </p>

                    <p className="text-sm text-gray-500">
                      {addr.barangay}, {addr.city}, {addr.province}
                    </p>

                    {addr.isDefault && (
                      <span className="text-xs text-red-500 border px-1">
                        Default
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setFormData(addr);
                      setEditingId(addr.id);
                      setIsEditing(true);
                      setShowAddressList(false);
                      setShowAddressModal(true);
                    }}
                    className="text-[#2787b4] text-sm font-medium "
                  >
                    Edit
                  </button>
                </div>

              </div>
            ))}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
  setShowAddressList(false);

  setFormData({
    fullName: '',
    phone: '',
    province: '',
    city: '',
    barangay: '',
    zipCode: '',
  });

  setIsEditing(false);
  setEditingId(null);

  setSelectedRegion('');
  setSelectedProvince('');
  setSelectedCity('');
  setTempBarangay('');
  setStep('region');

  setShowAddressModal(true);
}}
                className="bg-[#2787b4] text-white px-4 py-2 rounded"
              >
                + Add New Address
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= ADD / EDIT MODAL ================= */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-2xl rounded-lg p-6">

            <h2 className="text-lg font-semibold mb-6">
              {isEditing ? 'Edit Address' : 'New Address'}
            </h2>

            <div className="space-y-4">

  {/* FULL NAME + PHONE */}
  <div className="grid grid-cols-2 gap-4">

    <div>
      <label className="text-sm text-gray-600">Full Name</label>
      <Input
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
      />
    </div>

    <div>
      <label className="text-sm text-gray-600">Phone</label>
      <Input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
      />
    </div>

  </div>

  {/* ADDRESS */}
  <div>
  <label className="text-sm text-gray-600">
    Region, Province, City, Barangay
  </label>

  <button
    onClick={() => {
  setShowPicker(true);
  setStep('region');
}}
    className="w-full border rounded px-3 py-2 text-left text-sm"
  >
    {formData.barangay
      ? `${formData.barangay}, ${formData.city}, ${formData.province}`
      : 'Select Region, Province, City, Barangay'}
  </button>
</div>
  <div>
    <label className="text-sm text-gray-600">Zip Code</label>
    <Input
      name="zipCode"
      value={formData.zipCode}
      onChange={handleChange}
    />
  </div>

</div>

            <div className="flex justify-end gap-3 mt-6">
              <button
  onClick={() => {
    // close modal
    setShowAddressModal(false);

    // balik sa list
    setShowAddressList(true);

    // 🔥 reset form
    setFormData({
      fullName: '',
      phone: '',
      province: '',
      city: '',
      barangay: '',
      zipCode: '',
    });

    // reset edit state
    setIsEditing(false);
    setEditingId(null);

    // 🔥 reset picker state
    setSelectedRegion('');
    setSelectedProvince('');
    setSelectedCity('');
    setSelectedRegionName('');
    setSelectedProvinceName('');
    setSelectedCityName('');
    setTempBarangay('');
    setStep('region');

    // close picker if open
    setShowPicker(false);
  }}
>
  Cancel
</button>

              <button
                onClick={handleSaveAddress}
                className="bg-[#2787b4] text-white px-6 py-2 rounded"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
        
      )}
      {showPicker && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    
    <div className="bg-white w-full max-w-md rounded-lg">

      {/* HEADER TABS */}
      <div className="flex justify-between items-center border-b p-3">
  <span className="font-medium">Select Address</span>
  <button onClick={() => setShowPicker(false)}>✕</button>
</div>

<div className="flex border-b text-sm">

        <div
  onClick={() => setStep('region')}
  className={`flex-1 text-center py-2 cursor-pointer ${
    step === 'region' && 'text-[#2787b4] border-b-2 border-[#2787b4]'
  }`}
>
  {selectedRegionName || 'Region'}
</div>

 {/* Hide Province tab if selected region has no provinces */}
 {(!selectedRegion || provinces.some((p: any) => p.regionCode === selectedRegion)) && (
  <div
    onClick={() => selectedRegion && setStep('province')}
    className={`flex-1 text-center py-2 cursor-pointer ${
      step === 'province' && 'text-[#2787b4] border-b-2 border-[#2787b4]'
    }`}
  >
    {selectedProvinceName || 'Province'}
  </div>
)}

 {/* Hide City tab if selected province has no cities (only when province step is active) */}
 {(!selectedProvince || cities.some((c: any) => c.provinceCode === selectedProvince) || !provinces.some((p: any) => p.regionCode === selectedRegion)) && (
<div
  onClick={() => (selectedProvince || (selectedRegion && !provinces.some((p: any) => p.regionCode === selectedRegion))) && setStep('city')}
  className={`flex-1 text-center py-2 cursor-pointer ${
    step === 'city' && 'text-[#2787b4] border-b-2 border-[#2787b4]'
  }`}
>
  {selectedCityName || 'City'}
</div>
)}

<div
  onClick={() => selectedCity && setStep('barangay')}
  className={`flex-1 text-center py-2 cursor-pointer ${
    step === 'barangay' && 'text-[#2787b4] border-b-2 border-[#2787b4]'
  }`}
>
  Barangay
</div>

      </div>

      {/* LIST */}
      <div className="p-4 max-h-80 overflow-y-auto">

        {/* REGION */}
       {step === 'region' && (
  regions.map((r: any) => (
    <div
      key={r.code}
      onClick={() => {
  setSelectedRegion(r.code);
  setSelectedRegionName(r.name);

  setSelectedProvince('');
  setSelectedProvinceName('');
  setSelectedCity('');
  setSelectedCityName('');

  setTempBarangay('');

  // Dynamically skip province if this region has no provinces
  const hasProvinces = provinces.some((p: any) => p.regionCode === r.code);
  if (!hasProvinces) {
    setStep('city'); // skip province, go to city
  } else {
    setStep('province');
  }
}}
      className="py-2 cursor-pointer hover:bg-gray-100"
    >
      {r.name}
    </div>
  ))
)}

        {/* PROVINCE */}
        {step === 'province' && (
  provinces
    .filter((p: any) => p.regionCode === selectedRegion)
    .map((p: any) => (
      <div
        key={p.code}
        onClick={() => {
  setSelectedProvince(p.code);
  setSelectedProvinceName(p.name);

  setSelectedCity('');
  setSelectedCityName('');

  setTempBarangay('');
  setStep('city');
}}
        className="py-2 cursor-pointer hover:bg-gray-100"
      >
        {p.name}
      </div>
    ))
)}
        
        {/* CITY */}
        {step === 'city' && (
  cities
    .filter((c: any) => {
      // If region has no provinces, filter cities by regionCode directly
      const hasProvinces = provinces.some((p: any) => p.regionCode === selectedRegion);
      return hasProvinces
        ? c.provinceCode === selectedProvince
        : c.regionCode === selectedRegion;
    })
    .map((c: any) => (
      <div
        key={c.code}
        onClick={() => {
          setSelectedCity(c.code);
          setSelectedCityName(c.name);
          setTempBarangay('');
          setStep('barangay');
        }}
        className="py-2 cursor-pointer hover:bg-gray-100"
      >
        {c.name}
      </div>
    ))
)}
        

        {/* BARANGAY */}
        {step === 'barangay' && (
  barangays
    .filter((b: any) => b.cityCode === selectedCity)
    .map((b: any) => (
      <div
        key={b.code}
        onClick={() => {
          const hasProvinces = provinces.some((p: any) => p.regionCode === selectedRegion);
          setFormData(prev => ({
            ...prev,
            province: hasProvinces
              ? provinces.find((p: any) => p.code === selectedProvince)?.name
              : selectedRegionName, // Use region name when no provinces exist
            city: cities.find((c: any) => c.code === selectedCity)?.name,
            barangay: b.name
          }));

          setShowPicker(false);
          setStep('region');
        }}
        className="py-2 cursor-pointer hover:bg-gray-100"
      >
        {b.name}
      </div>
    ))
)}

      </div>

    </div>
  </div>
)}
    </div>
  );
}