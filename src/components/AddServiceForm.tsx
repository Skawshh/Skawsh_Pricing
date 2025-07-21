import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClothingItem {
  id: string;
  type: string;
  standardPrice: string;
  expressPrice: string;
}

const AddServiceForm = () => {
  const { toast } = useToast();
  const [serviceName, setServiceName] = useState('');
  const [showSubServiceForm, setShowSubServiceForm] = useState(false);
  const [savedSubServices, setSavedSubServices] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    subServiceName: '',
    washTypes: [] as string[],
    pricingType: 'perKg',
    standardPricePerKg: '',
    expressPricePerKg: '',
  });
  
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [selectedClothingType, setSelectedClothingType] = useState('');
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const serviceOptions = [
    'Core Laundry Services',
    'Shoe Cleaning',
    'Dry Cleaning Specialty',
    'Alterations & Repairs',
    'Fabric Care'
  ];

  const subServiceOptions = [
    'Wash & Fold',
    'Dry Cleaning',
    'Steam Ironing',
    'Stain Removal',
    'Delicate Care'
  ];

  const clothingTypes = [
    'Shirt',
    'Short Dress',
    'Saree',
    'Trouser',
    'Blouse',
    'Suit',
    'Jacket',
    'Skirt',
    'T-Shirt'
  ];

  const washTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      washTypes: prev.washTypes.includes(type)
        ? prev.washTypes.filter(t => t !== type)
        : [...prev.washTypes, type]
    }));
  };

  const addClothingItem = () => {
    if (!selectedClothingType) return;
    
    const newItem: ClothingItem = {
      id: Date.now().toString(),
      type: selectedClothingType,
      standardPrice: '',
      expressPrice: ''
    };
    
    setClothingItems(prev => [...prev, newItem]);
    setSelectedClothingType('');
  };

  const removeClothingItem = (id: string) => {
    setClothingItems(prev => prev.filter(item => item.id !== id));
  };

  const updateClothingItem = (id: string, field: string, value: string) => {
    setClothingItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addSubService = () => {
    if (serviceName) {
      setShowSubServiceForm(true);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    
    if (!formData.subServiceName) newErrors.subServiceName = true;
    if (formData.washTypes.length === 0) newErrors.washTypes = true;
    
    if (formData.pricingType === 'perKg') {
      if (formData.washTypes.includes('standard') && !formData.standardPricePerKg) {
        newErrors.standardPricePerKg = true;
      }
      if (formData.washTypes.includes('express') && !formData.expressPricePerKg) {
        newErrors.expressPricePerKg = true;
      }
    } else if (formData.pricingType === 'clothingItems') {
      if (clothingItems.length === 0) newErrors.clothingItems = true;
      clothingItems.forEach(item => {
        if (formData.washTypes.includes('standard') && !item.standardPrice) {
          newErrors[`${item.id}_standard`] = true;
        }
        if (formData.washTypes.includes('express') && !item.expressPrice) {
          newErrors[`${item.id}_express`] = true;
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveSubService = () => {
    if (validateForm()) {
      const newSubService = {
        id: Date.now().toString(),
        ...formData,
        clothingItems: [...clothingItems]
      };
      
      setSavedSubServices(prev => [...prev, newSubService]);
      
      // Reset form for next sub service
      setFormData({
        subServiceName: '',
        washTypes: [],
        pricingType: 'perKg',
        standardPricePerKg: '',
        expressPricePerKg: '',
      });
      setClothingItems([]);
      setErrors({});
      setShowSubServiceForm(false);
      
      toast({
        title: "Sub-Service Saved Successfully",
        description: "You can now add another sub-service.",
      });
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setServiceName('');
    setShowSubServiceForm(false);
    setSavedSubServices([]);
    setFormData({
      subServiceName: '',
      washTypes: [],
      pricingType: 'perKg',
      standardPricePerKg: '',
      expressPricePerKg: '',
    });
    setClothingItems([]);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="border-b border-gray-200 bg-white relative">
            <button 
              onClick={handleCancel}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Add Service
            </CardTitle>
            <p className="text-gray-600 text-sm">Add a new service with its subservices and items</p>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Service Selection */}
            <div className="space-y-3">
              <Label htmlFor="serviceName" className="text-base font-medium text-gray-700">
                Service Name *
              </Label>
              <Select 
                value={serviceName} 
                onValueChange={setServiceName}
              >
                <SelectTrigger className="h-12 border border-gray-300 bg-white hover:border-gray-400 transition-colors">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {serviceOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sub Services Section */}
            {serviceName && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium text-gray-700">Sub Services</Label>
                  {savedSubServices.length > 0 && (
                    <span className="text-sm text-gray-600">{savedSubServices.length} sub-service(s) added</span>
                  )}
                </div>
                
                {!showSubServiceForm && (
                  <Button 
                    onClick={addSubService}
                    className="h-11 bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sub Service
                  </Button>
                )}
                
                {/* Sub Service Form */}
                {showSubServiceForm && (
                  <div className="space-y-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="space-y-3">
                      <Label htmlFor="subServiceName" className="text-sm font-medium text-gray-700">
                        Sub Service Name *
                      </Label>
                      <Select 
                        value={formData.subServiceName} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, subServiceName: value }))}
                      >
                        <SelectTrigger className={`h-11 border ${errors.subServiceName ? 'border-red-400' : 'border-gray-300'} bg-white hover:border-gray-400 transition-colors`}>
                          <SelectValue placeholder="Select sub service name" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          {subServiceOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Wash Type Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">Wash Type Selection *</Label>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="standard"
                            checked={formData.washTypes.includes('standard')}
                            onCheckedChange={() => washTypeToggle('standard')}
                          />
                          <Label 
                            htmlFor="standard" 
                            className="text-sm font-medium cursor-pointer text-gray-700"
                          >
                            Standard Wash
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="express"
                            checked={formData.washTypes.includes('express')}
                            onCheckedChange={() => washTypeToggle('express')}
                          />
                          <Label 
                            htmlFor="express" 
                            className="text-sm font-medium cursor-pointer text-gray-700"
                          >
                            Express Wash
                          </Label>
                        </div>
                      </div>
                      {errors.washTypes && (
                        <p className="text-sm text-red-600">Please select at least one wash type</p>
                      )}
                    </div>

                    {/* Pricing Type Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">Pricing Type</Label>
                      <RadioGroup 
                        value={formData.pricingType} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, pricingType: value }))}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="perKg" id="perKg" />
                          <Label htmlFor="perKg" className="text-gray-700">Per KG</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="clothingItems" id="clothingItems" />
                          <Label htmlFor="clothingItems" className="text-gray-700">Clothing Items</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Conditional Pricing Fields */}
                    {formData.pricingType === 'perKg' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {formData.washTypes.includes('standard') && (
                            <div className="space-y-2">
                              <Label htmlFor="standardPrice" className="text-sm font-medium text-gray-700">
                                Standard Price per KG
                              </Label>
                              <Input
                                id="standardPrice"
                                type="number"
                                placeholder="0.00"
                                value={formData.standardPricePerKg}
                                onChange={(e) => setFormData(prev => ({ ...prev, standardPricePerKg: e.target.value }))}
                                className={`h-10 ${errors.standardPricePerKg ? 'border-red-400' : 'border-gray-300'}`}
                              />
                            </div>
                          )}
                          
                          {formData.washTypes.includes('express') && (
                            <div className="space-y-2">
                              <Label htmlFor="expressPrice" className="text-sm font-medium text-gray-700">
                                Express Price per KG
                              </Label>
                              <Input
                                id="expressPrice"
                                type="number"
                                placeholder="0.00"
                                value={formData.expressPricePerKg}
                                onChange={(e) => setFormData(prev => ({ ...prev, expressPricePerKg: e.target.value }))}
                                className={`h-10 ${errors.expressPricePerKg ? 'border-red-400' : 'border-gray-300'}`}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {formData.pricingType === 'clothingItems' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-gray-700">Clothing Items</Label>
                          {errors.clothingItems && (
                            <p className="text-sm text-red-600">Please add at least one clothing item</p>
                          )}
                        </div>
                        
                        {/* Add New Item */}
                        <div className="flex gap-3 items-end">
                          <div className="flex-1 space-y-2">
                            <Label htmlFor="clothingType" className="text-sm font-medium text-gray-700">
                              Add New Item
                            </Label>
                            <Select value={selectedClothingType} onValueChange={setSelectedClothingType}>
                              <SelectTrigger className="h-10 border-gray-300">
                                <SelectValue placeholder="Select clothing type" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-200">
                                {clothingTypes.filter(type => !clothingItems.some(item => item.type === type)).map(type => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button 
                            type="button" 
                            onClick={addClothingItem}
                            disabled={!selectedClothingType}
                            className="h-10 bg-gray-600 hover:bg-gray-700 text-white"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Item
                          </Button>
                        </div>

                        {/* Clothing Items List */}
                        {clothingItems.length > 0 && (
                          <div className="space-y-3">
                            {clothingItems.map((item) => (
                              <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-white space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-gray-700">{item.type}</h4>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeClothingItem(item.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {formData.washTypes.includes('standard') && (
                                    <div className="space-y-1">
                                      <Label className="text-sm text-gray-700">Standard Price</Label>
                                      <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={item.standardPrice}
                                        onChange={(e) => updateClothingItem(item.id, 'standardPrice', e.target.value)}
                                        className={`h-9 ${errors[`${item.id}_standard`] ? 'border-red-400' : 'border-gray-300'}`}
                                      />
                                    </div>
                                  )}
                                  
                                  {formData.washTypes.includes('express') && (
                                    <div className="space-y-1">
                                      <Label className="text-sm text-gray-700">Express Price</Label>
                                      <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={item.expressPrice}
                                        onChange={(e) => updateClothingItem(item.id, 'expressPrice', e.target.value)}
                                        className={`h-9 ${errors[`${item.id}_express`] ? 'border-red-400' : 'border-gray-300'}`}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Save Sub Service Button */}
                    <div className="flex gap-3 pt-4 border-t border-gray-300">
                      <Button 
                        onClick={handleSaveSubService}
                        className="h-11 bg-green-600 hover:bg-green-700 text-white px-6"
                      >
                        Save Sub-Service
                      </Button>
                      <Button 
                        onClick={() => setShowSubServiceForm(false)}
                        variant="outline"
                        className="h-11 border border-gray-300 text-gray-700 hover:bg-gray-100"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Saved Sub Services Display */}
                {savedSubServices.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Saved Sub-Services:</h4>
                    {savedSubServices.map((subService, index) => (
                      <div key={subService.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <span className="text-green-800 font-medium">{index + 1}. {subService.subServiceName}</span>
                        <span className="text-green-600 text-sm ml-2">
                          ({subService.washTypes.join(', ')})
                        </span>
                      </div>
                    ))}
                    
                    {/* Add Another Sub Service Button */}
                    {!showSubServiceForm && (
                      <Button 
                        onClick={addSubService}
                        variant="outline"
                        className="h-10 border border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Sub Service
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddServiceForm;