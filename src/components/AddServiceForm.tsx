import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClothingItem {
  id: string;
  type: string;
  standardPrice: string;
  expressPrice: string;
}

const AddServiceForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    serviceName: '',
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

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    
    if (!formData.serviceName) newErrors.serviceName = true;
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

  const handleSave = () => {
    if (validateForm()) {
      toast({
        title: "Service Added Successfully",
        description: "The sub service has been saved to the system.",
      });
      console.log('Form Data:', formData);
      console.log('Clothing Items:', clothingItems);
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      serviceName: '',
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
    <div className="min-h-screen bg-laundry-background p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-medium border-laundry-border">
          <CardHeader className="border-b border-laundry-border bg-laundry-card">
            <CardTitle className="text-2xl font-semibold text-foreground">
              Add Service
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Service Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="serviceName" className="text-sm font-medium">
                  Service Name *
                </Label>
                <Select 
                  value={formData.serviceName} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, serviceName: value }))}
                >
                  <SelectTrigger className={`h-11 ${errors.serviceName ? 'border-destructive' : 'border-laundry-border'}`}>
                    <SelectValue placeholder="Select service name" />
                  </SelectTrigger>
                  <SelectContent className="bg-laundry-card border-laundry-border">
                    {serviceOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subServiceName" className="text-sm font-medium">
                  Sub Service Name *
                </Label>
                <Select 
                  value={formData.subServiceName} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, subServiceName: value }))}
                >
                  <SelectTrigger className={`h-11 ${errors.subServiceName ? 'border-destructive' : 'border-laundry-border'}`}>
                    <SelectValue placeholder="Select sub service name" />
                  </SelectTrigger>
                  <SelectContent className="bg-laundry-card border-laundry-border">
                    {subServiceOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Wash Type Selection */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Wash Type Selection</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.washTypes.includes('standard') ? 'default' : 'outline'}
                  onClick={() => washTypeToggle('standard')}
                  className="px-8 py-3 h-auto"
                >
                  Standard
                </Button>
                <Button
                  type="button"
                  variant={formData.washTypes.includes('express') ? 'default' : 'outline'}
                  onClick={() => washTypeToggle('express')}
                  className="px-8 py-3 h-auto"
                >
                  Express
                </Button>
              </div>
              {errors.washTypes && (
                <p className="text-sm text-destructive">Please select at least one wash type</p>
              )}
            </div>

            {/* Pricing Type Selection */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Pricing Type</Label>
              <RadioGroup 
                value={formData.pricingType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, pricingType: value }))}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="perKg" id="perKg" />
                  <Label htmlFor="perKg">Per KG</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="clothingItems" id="clothingItems" />
                  <Label htmlFor="clothingItems">Clothing Items</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Conditional Pricing Fields */}
            {formData.pricingType === 'perKg' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formData.washTypes.includes('standard') && (
                    <div className="space-y-2">
                      <Label htmlFor="standardPrice" className="text-sm font-medium">
                        Standard Price per KG
                      </Label>
                      <Input
                        id="standardPrice"
                        type="number"
                        placeholder="0.00"
                        value={formData.standardPricePerKg}
                        onChange={(e) => setFormData(prev => ({ ...prev, standardPricePerKg: e.target.value }))}
                        className={`h-11 ${errors.standardPricePerKg ? 'border-destructive' : 'border-laundry-border'}`}
                      />
                    </div>
                  )}
                  
                  {formData.washTypes.includes('express') && (
                    <div className="space-y-2">
                      <Label htmlFor="expressPrice" className="text-sm font-medium">
                        Express Price per KG
                      </Label>
                      <Input
                        id="expressPrice"
                        type="number"
                        placeholder="0.00"
                        value={formData.expressPricePerKg}
                        onChange={(e) => setFormData(prev => ({ ...prev, expressPricePerKg: e.target.value }))}
                        className={`h-11 ${errors.expressPricePerKg ? 'border-destructive' : 'border-laundry-border'}`}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {formData.pricingType === 'clothingItems' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-medium">Clothing Items</Label>
                  {errors.clothingItems && (
                    <p className="text-sm text-destructive">Please add at least one clothing item</p>
                  )}
                </div>
                
                {/* Add New Item */}
                <div className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="clothingType" className="text-sm font-medium">
                      Add New Item
                    </Label>
                    <Select value={selectedClothingType} onValueChange={setSelectedClothingType}>
                      <SelectTrigger className="h-11 border-laundry-border">
                        <SelectValue placeholder="Select clothing type" />
                      </SelectTrigger>
                      <SelectContent className="bg-laundry-card border-laundry-border">
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
                    variant="laundry"
                    className="h-11"
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                {/* Clothing Items List */}
                {clothingItems.length > 0 && (
                  <div className="space-y-4">
                    {clothingItems.map((item) => (
                      <div key={item.id} className="p-4 border border-laundry-border rounded-lg bg-laundry-card space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{item.type}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeClothingItem(item.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {formData.washTypes.includes('standard') && (
                            <div className="space-y-2">
                              <Label className="text-sm">Standard Price</Label>
                              <Input
                                type="number"
                                placeholder="0.00"
                                value={item.standardPrice}
                                onChange={(e) => updateClothingItem(item.id, 'standardPrice', e.target.value)}
                                className={`h-10 ${errors[`${item.id}_standard`] ? 'border-destructive' : 'border-laundry-border'}`}
                              />
                            </div>
                          )}
                          
                          {formData.washTypes.includes('express') && (
                            <div className="space-y-2">
                              <Label className="text-sm">Express Price</Label>
                              <Input
                                type="number"
                                placeholder="0.00"
                                value={item.expressPrice}
                                onChange={(e) => updateClothingItem(item.id, 'expressPrice', e.target.value)}
                                className={`h-10 ${errors[`${item.id}_express`] ? 'border-destructive' : 'border-laundry-border'}`}
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-laundry-border">
              <Button 
                variant="laundry" 
                onClick={handleSave}
                className="sm:flex-1"
              >
                Save Sub Service
              </Button>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="px-8"
                >
                  Cancel
                </Button>
                <Button 
                  variant="laundry" 
                  onClick={handleSave}
                  className="px-8"
                >
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddServiceForm;