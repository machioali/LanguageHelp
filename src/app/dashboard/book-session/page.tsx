'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import {
  Calendar,
  Clock,
  Globe,
  Video,
  Phone,
  Users,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  MapPin,
  Search,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  languages, 
  getLanguagesByCategory, 
  getTopLanguages,
  searchLanguages,
  type Language 
} from '@/data/languages';

const specializations = [
  { id: 'medical', name: 'Medical', icon: '🏥' },
  { id: 'legal', name: 'Legal', icon: '⚖️' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'education', name: 'Education', icon: '🎓' },
  { id: 'technical', name: 'Technical', icon: '🔧' },
  { id: 'general', name: 'General', icon: '💬' },
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export default function BookSessionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [fromLanguageSearch, setFromLanguageSearch] = useState('');
  const [toLanguageSearch, setToLanguageSearch] = useState('');
  
  const [formData, setFormData] = useState({
    sessionType: '',
    languageFrom: 'English',
    languageTo: '',
    specialization: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: '30',
    priority: 'normal',
    notes: '',
    isUrgent: false
  });

  // Filter languages based on search queries
  const filteredFromLanguages = useMemo(() => {
    if (!fromLanguageSearch.trim()) {
      return getTopLanguages(20);
    }
    return searchLanguages(fromLanguageSearch);
  }, [fromLanguageSearch]);

  const filteredToLanguages = useMemo(() => {
    if (!toLanguageSearch.trim()) {
      return getLanguagesByCategory();
    }
    const searchResults = searchLanguages(toLanguageSearch);
    // Group search results by category for better organization
    const grouped = {
      popular: searchResults.filter(lang => lang.category === 'popular'),
      common: searchResults.filter(lang => lang.category === 'common'),
      specialized: searchResults.filter(lang => lang.category === 'specialized'),
      regional: searchResults.filter(lang => lang.category === 'regional')
    };
    return grouped;
  }, [toLanguageSearch]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Convert date and time to ISO string
      let scheduledAt = null;
      if (formData.scheduledDate && formData.scheduledTime) {
        scheduledAt = new Date(`${formData.scheduledDate}T${formData.scheduledTime}:00`).toISOString();
      }

      const response = await fetch('/api/client/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          scheduledAt,
          duration: parseInt(formData.duration),
          isUrgent: formData.priority === 'urgent'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Session Booked',
          description: 'Your interpretation session has been requested successfully.'
        });
        router.push('/dashboard/sessions');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to book session:', error);
      toast({
        title: 'Error',
        description: 'Failed to book session. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = formData.sessionType && formData.languageTo;
  const isStep2Valid = formData.specialization && (formData.scheduledDate || formData.priority === 'urgent');

  return (
    <div className="relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[calc(50%-15rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-25rem)]" aria-hidden="true">
          <div className="aspect-[1108/632] w-[50rem] bg-gradient-to-r from-primary/20 to-secondary/20 opacity-20" style={{ clipPath: 'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)' }} />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-8">
        {/* Hero Header */}
        <section className="relative py-8 mb-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex justify-center">
              <div className="relative rounded-full px-4 py-2 text-sm leading-6 text-muted-foreground ring-1 ring-primary/10 hover:ring-primary/20 transition-all duration-300">
                Professional interpretation services
                <Link href="/dashboard" className="font-semibold text-primary ml-1">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Back to dashboard <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Book
              <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"> Interpretation Session</span>
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Schedule a professional interpretation session for your needs in just a few simple steps.
            </p>
          </div>
        </section>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav className="flex items-center justify-center" aria-label="Progress">
            <ol className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <li key={step} className="flex items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                      step <= currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                    )}
                  >
                    {step < currentStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 3 && (
                    <div
                      className={cn(
                        "w-12 h-0.5 ml-4",
                        step < currentStep ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                      )}
                    />
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-16 text-xs text-gray-500">
              <span className={cn(currentStep >= 1 && "text-primary")}>Session Type</span>
              <span className={cn(currentStep >= 2 && "text-primary")}>Details</span>
              <span className={cn(currentStep >= 3 && "text-primary")}>Review</span>
            </div>
          </div>
        </div>

        <Card>
        <CardHeader>
          <CardTitle>
            Step {currentStep} of 3: {
              currentStep === 1 ? 'Session Type & Language' :
              currentStep === 2 ? 'Session Details' :
              'Review & Confirm'
            }
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && 'Choose your session type and language pair'}
            {currentStep === 2 && 'Provide additional details for your session'}
            {currentStep === 3 && 'Review your session details and confirm booking'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Step 1: Session Type & Language */}
          {currentStep === 1 && (
            <>
              {/* Session Type */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Session Type</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card
                    className={cn(
                      "cursor-pointer border-2 transition-colors",
                      formData.sessionType === 'VRI'
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => updateField('sessionType', 'VRI')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Video className="h-6 w-6 text-primary" />
                        <div>
                          <h3 className="font-medium">Video Call (VRI)</h3>
                          <p className="text-sm text-muted-foreground">
                            Video interpretation with visual communication
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card
                    className={cn(
                      "cursor-pointer border-2 transition-colors",
                      formData.sessionType === 'OPI'
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => updateField('sessionType', 'OPI')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-6 w-6 text-primary" />
                        <div>
                          <h3 className="font-medium">Audio Call (OPI)</h3>
                          <p className="text-sm text-muted-foreground">
                            Audio-only interpretation for phone calls
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Language Selection with Advanced Selector */}
              <div className="space-y-6">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">200+ Languages Supported</h3>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Choose from our extensive collection of languages including popular, specialized, regional, and sign languages
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      <Star className="w-3 h-3 mr-1" />
                      Popular Languages
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      <Zap className="w-3 h-3 mr-1" />
                      Specialized Languages
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <MapPin className="w-3 h-3 mr-1" />
                      Regional Languages
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="languageFrom">From Language</Label>
                    <Select
                      value={formData.languageFrom}
                      onValueChange={(value) => updateField('languageFrom', value)}
                      onOpenChange={(open) => {
                        if (!open) {
                          setFromLanguageSearch('');
                        }
                      }}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent 
                        className="max-h-80 p-0" 
                        onKeyDown={(e) => {
                          // Prevent ALL keyboard navigation in Select
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onWheel={(e) => {
                          // Allow scrolling but stop propagation
                          e.stopPropagation();
                        }}
                      >
                        {/* Fixed Search Bar Section */}
                        <div className="sticky top-0 z-50 bg-background border-b p-2 shadow-sm">
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input
                              placeholder="Search languages..."
                              value={fromLanguageSearch}
                              onChange={(e) => {
                                setFromLanguageSearch(e.target.value);
                                e.stopPropagation();
                              }}
                              className="pl-8 h-9 border-0 bg-muted/30 focus:bg-background transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.currentTarget.focus();
                              }}
                              onKeyDown={(e) => {
                                // Stop propagation to prevent Select from handling these events
                                e.stopPropagation();
                                
                                // Handle search-specific keys
                                if (e.key === 'Escape') {
                                  e.preventDefault();
                                  setFromLanguageSearch('');
                                  e.currentTarget.blur();
                                } else if (e.key === 'Enter') {
                                  e.preventDefault();
                                } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                                  // Prevent arrow key navigation in Select
                                  e.preventDefault();
                                }
                                // Don't return false - let normal typing work
                              }}
                              onFocus={(e) => {
                                e.stopPropagation();
                              }}
                              onMouseDown={(e) => {
                                e.stopPropagation();
                              }}
                              autoComplete="off"
                              autoCapitalize="off"
                              spellCheck={false}
                            />
                            {fromLanguageSearch && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setFromLanguageSearch('');
                                }}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Scrollable Languages Section */}
                        <div className="max-h-64 overflow-y-auto">

                        {/* Show English first if no search */}
                        {!fromLanguageSearch && (
                          <>
                            <SelectItem value="English">
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">English</span>
                                  <span className="text-xs text-muted-foreground">Native</span>
                                </div>
                                <Badge className="bg-yellow-100 text-yellow-800 text-xs">Global</Badge>
                              </div>
                            </SelectItem>
                            <Separator className="my-1" />
                          </>
                        )}

                        {/* Filtered Languages */}
                        {filteredFromLanguages.filter(lang => lang.name !== 'English' || fromLanguageSearch).map((lang) => (
                          <SelectItem key={lang.code} value={lang.name}>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{lang.name}</span>
                                {lang.nativeName !== lang.name && (
                                  <span className="text-xs text-muted-foreground">({lang.nativeName})</span>
                                )}
                              </div>
                              <div className="flex items-center space-x-1">
                                <Badge className={`text-xs ${
                                  lang.category === 'popular' ? 'bg-yellow-100 text-yellow-800' :
                                  lang.category === 'common' ? 'bg-blue-100 text-blue-800' :
                                  lang.category === 'specialized' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {lang.category}
                                </Badge>
                              </div>
                            </div>
                          </SelectItem>
                        ))}

                        {/* No results message */}
                        {fromLanguageSearch && filteredFromLanguages.length === 0 && (
                          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                            No languages found matching "{fromLanguageSearch}"
                          </div>
                        )}

                        {/* Show total count */}
                        {!fromLanguageSearch && (
                          <>
                            <Separator className="my-2" />
                            <div className="px-2 py-1 text-center">
                              <div className="text-xs text-muted-foreground">{languages.length} total languages available</div>
                            </div>
                          </>
                        )}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="languageTo">
                      To Language *
                      <span className="text-xs text-muted-foreground ml-2">({languages.length} available)</span>
                    </Label>
                    <Select
                      value={formData.languageTo}
                      onValueChange={(value) => updateField('languageTo', value)}
                      onOpenChange={(open) => {
                        if (!open) {
                          setToLanguageSearch('');
                        }
                      }}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Choose from 200+ languages..." />
                      </SelectTrigger>
                      <SelectContent 
                        className="max-h-80 p-0" 
                        onKeyDown={(e) => {
                          // Prevent ALL keyboard navigation in Select
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onWheel={(e) => {
                          // Allow scrolling but stop propagation
                          e.stopPropagation();
                        }}
                      >
                        {/* Fixed Search Bar Section */}
                        <div className="sticky top-0 z-50 bg-background border-b p-2 shadow-sm">
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input
                              placeholder="Search languages..."
                              value={toLanguageSearch}
                              onChange={(e) => {
                                setToLanguageSearch(e.target.value);
                                e.stopPropagation();
                              }}
                              className="pl-8 h-9 border-0 bg-muted/30 focus:bg-background transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.currentTarget.focus();
                              }}
                              onKeyDown={(e) => {
                                // Stop propagation to prevent Select from handling these events
                                e.stopPropagation();
                                
                                // Handle search-specific keys
                                if (e.key === 'Escape') {
                                  e.preventDefault();
                                  setToLanguageSearch('');
                                  e.currentTarget.blur();
                                } else if (e.key === 'Enter') {
                                  e.preventDefault();
                                } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                                  // Prevent arrow key navigation in Select
                                  e.preventDefault();
                                }
                                // Don't return false - let normal typing work
                              }}
                              onFocus={(e) => {
                                e.stopPropagation();
                              }}
                              onMouseDown={(e) => {
                                e.stopPropagation();
                              }}
                              autoComplete="off"
                              autoCapitalize="off"
                              spellCheck={false}
                            />
                            {toLanguageSearch && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setToLanguageSearch('');
                                }}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Scrollable Languages Section */}
                        <div className="max-h-64 overflow-y-auto">

                        {/* Popular Languages */}
                        {filteredToLanguages.popular.length > 0 && (
                          <>
                            <div className="px-2 py-1">
                              <div className="text-xs font-medium text-primary flex items-center">
                                <Star className="w-3 h-3 mr-1" />
                                Popular Languages
                              </div>
                            </div>
                            {filteredToLanguages.popular.map((lang) => (
                              <SelectItem key={lang.code} value={lang.name}>
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">{lang.name}</span>
                                    {lang.nativeName !== lang.name && (
                                      <span className="text-xs text-muted-foreground">({lang.nativeName})</span>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <span className="text-xs text-gray-500">{lang.speakers >= 1 ? `${lang.speakers}M` : `${(lang.speakers * 1000).toFixed(0)}K`}</span>
                                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">Popular</Badge>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </>
                        )}
                        
                        {/* Common Languages */}
                        {filteredToLanguages.common.length > 0 && (
                          <>
                            {filteredToLanguages.popular.length > 0 && <Separator className="my-2" />}
                            <div className="px-2 py-1">
                              <div className="text-xs font-medium text-muted-foreground flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                Common Languages
                              </div>
                            </div>
                            {filteredToLanguages.common.map((lang) => (
                              <SelectItem key={lang.code} value={lang.name}>
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">{lang.name}</span>
                                    {lang.nativeName !== lang.name && (
                                      <span className="text-xs text-muted-foreground">({lang.nativeName})</span>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <span className="text-xs text-gray-500">{lang.region}</span>
                                    <Badge className="bg-blue-100 text-blue-800 text-xs">Common</Badge>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </>
                        )}
                        
                        {/* Specialized Languages */}
                        {filteredToLanguages.specialized.length > 0 && (
                          <>
                            {(filteredToLanguages.popular.length > 0 || filteredToLanguages.common.length > 0) && <Separator className="my-2" />}
                            <div className="px-2 py-1">
                              <div className="text-xs font-medium text-muted-foreground flex items-center">
                                <Zap className="w-3 h-3 mr-1" />
                                Specialized Languages
                              </div>
                            </div>
                            {filteredToLanguages.specialized.slice(0, toLanguageSearch ? 50 : 15).map((lang) => (
                              <SelectItem key={lang.code} value={lang.name}>
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">{lang.name}</span>
                                    {lang.nativeName !== lang.name && (
                                      <span className="text-xs text-muted-foreground">({lang.nativeName})</span>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <span className="text-xs text-gray-500">{lang.region}</span>
                                    <Badge className="bg-purple-100 text-purple-800 text-xs">Specialized</Badge>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </>
                        )}
                        
                        {/* Regional Languages */}
                        {filteredToLanguages.regional && filteredToLanguages.regional.length > 0 && (
                          <>
                            {(filteredToLanguages.popular.length > 0 || filteredToLanguages.common.length > 0 || filteredToLanguages.specialized.length > 0) && <Separator className="my-2" />}
                            <div className="px-2 py-1">
                              <div className="text-xs font-medium text-muted-foreground flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                Regional Languages
                              </div>
                            </div>
                            {filteredToLanguages.regional.slice(0, toLanguageSearch ? 50 : 10).map((lang) => (
                              <SelectItem key={lang.code} value={lang.name}>
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">{lang.name}</span>
                                    {lang.nativeName !== lang.name && (
                                      <span className="text-xs text-muted-foreground">({lang.nativeName})</span>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <span className="text-xs text-gray-500">{lang.region}</span>
                                    <Badge className="bg-green-100 text-green-800 text-xs">Regional</Badge>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </>
                        )}

                        {/* No results message */}
                        {toLanguageSearch && 
                         filteredToLanguages.popular.length === 0 && 
                         filteredToLanguages.common.length === 0 && 
                         filteredToLanguages.specialized.length === 0 && 
                         (!filteredToLanguages.regional || filteredToLanguages.regional.length === 0) && (
                          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                            No languages found matching "{toLanguageSearch}"
                          </div>
                        )}
                        
                        {/* Show total count when not searching */}
                        {!toLanguageSearch && (
                          <>
                            <Separator className="my-2" />
                            <div className="px-2 py-1 text-center">
                              <div className="text-xs text-muted-foreground">
                                {languages.length} total languages available • Showing most common
                              </div>
                            </div>
                          </>
                        )}
                        </div>
                      </SelectContent>
                    </Select>
                    
                    {/* Language Information */}
                    {formData.languageTo && (() => {
                      const selectedLang = languages.find(lang => lang.name === formData.languageTo);
                      if (selectedLang) {
                        return (
                          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{selectedLang.name}</span>
                                {selectedLang.nativeName !== selectedLang.name && (
                                  <span className="text-muted-foreground">({selectedLang.nativeName})</span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={`text-xs ${
                                  selectedLang.category === 'popular' ? 'bg-yellow-100 text-yellow-800' :
                                  selectedLang.category === 'common' ? 'bg-blue-100 text-blue-800' :
                                  selectedLang.category === 'specialized' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {selectedLang.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {selectedLang.region}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {selectedLang.speakers >= 1 ? `${selectedLang.speakers} million speakers` : `${(selectedLang.speakers * 1000).toFixed(0)}K speakers`}
                              {selectedLang.difficulty && ` • ${selectedLang.difficulty} difficulty`}
                              {selectedLang.rtl && ' • Right-to-left script'}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Session Details */}
          {currentStep === 2 && (
            <>
              {/* Specialization */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Specialization *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {specializations.map((spec) => (
                    <Card
                      key={spec.id}
                      className={cn(
                        "cursor-pointer border-2 transition-colors",
                        formData.specialization === spec.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => updateField('specialization', spec.id)}
                    >
                      <CardContent className="p-3 text-center">
                        <div className="text-2xl mb-2">{spec.icon}</div>
                        <div className="text-sm font-medium">{spec.name}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Priority & Scheduling */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-base font-medium">When do you need this session?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card
                      className={cn(
                        "cursor-pointer border-2 transition-colors",
                        formData.priority === 'urgent'
                          ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => updateField('priority', 'urgent')}
                    >
                      <CardContent className="p-4 text-center">
                        <AlertCircle className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                        <h3 className="font-medium">Right Now</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect within 5 minutes
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card
                      className={cn(
                        "cursor-pointer border-2 transition-colors",
                        formData.priority === 'normal'
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => updateField('priority', 'normal')}
                    >
                      <CardContent className="p-4 text-center">
                        <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                        <h3 className="font-medium">Schedule</h3>
                        <p className="text-sm text-muted-foreground">
                          Book for later
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card
                      className={cn(
                        "cursor-pointer border-2 transition-colors",
                        formData.priority === 'flexible'
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => updateField('priority', 'flexible')}
                    >
                      <CardContent className="p-4 text-center">
                        <Clock className="h-6 w-6 text-green-500 mx-auto mb-2" />
                        <h3 className="font-medium">Flexible</h3>
                        <p className="text-sm text-muted-foreground">
                          Next available slot
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Scheduled Time Selection */}
                {formData.priority === 'normal' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date *</Label>
                      <Input
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(e) => updateField('scheduledDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time</Label>
                      <Select
                        value={formData.scheduledTime}
                        onValueChange={(value) => updateField('scheduledTime', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Duration & Notes */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Expected Duration (minutes)</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) => updateField('duration', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Provide any context or special requirements for your session..."
                    value={formData.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    Include any relevant context to help your interpreter prepare
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg">Session Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Session Type:</span>
                      <div className="flex items-center mt-1">
                        {formData.sessionType === 'VRI' ? (
                          <>
                            <Video className="h-4 w-4 mr-2" />
                            Video Call (VRI)
                          </>
                        ) : (
                          <>
                            <Phone className="h-4 w-4 mr-2" />
                            Audio Call (OPI)
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium">Languages:</span>
                      <div className="mt-1">
                        {formData.languageFrom} → {formData.languageTo}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium">Specialization:</span>
                      <div className="mt-1">
                        {specializations.find(s => s.id === formData.specialization)?.name}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium">Duration:</span>
                      <div className="mt-1">{formData.duration} minutes</div>
                    </div>
                    
                    <div>
                      <span className="font-medium">Priority:</span>
                      <div className="mt-1 capitalize">
                        <Badge variant={
                          formData.priority === 'urgent' ? 'destructive' :
                          formData.priority === 'flexible' ? 'secondary' : 'default'
                        }>
                          {formData.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    {formData.scheduledDate && (
                      <div>
                        <span className="font-medium">Scheduled:</span>
                        <div className="mt-1">
                          {new Date(formData.scheduledDate).toLocaleDateString()} 
                          {formData.scheduledTime && ` at ${formData.scheduledTime}`}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {formData.notes && (
                    <div>
                      <span className="font-medium">Notes:</span>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formData.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                      What happens next?
                    </p>
                    <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Your session request will be sent to available interpreters</li>
                      <li>• You'll receive a confirmation email with session details</li>
                      <li>• An interpreter will be matched within 15 minutes</li>
                      <li>• You'll get a notification when your session is ready to start</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            
            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !isStep1Valid) ||
                  (currentStep === 2 && !isStep2Valid)
                }
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Booking...
                  </>
                ) : (
                  <>
                    Book Session
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
