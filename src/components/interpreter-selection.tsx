'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  Clock, 
  MapPin, 
  Award, 
  Phone, 
  Video,
  Users,
  Zap,
  CheckCircle,
  AlertCircle,
  Globe
} from 'lucide-react';

interface InterpreterProfile {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  totalSessions: number;
  languages: Array<{
    code: string;
    name: string;
    proficiency: 'native' | 'fluent' | 'professional';
  }>;
  specializations: string[];
  location: string;
  timezone: string;
  responseTime: number; // average seconds to accept calls
  availability: 'online' | 'busy' | 'away' | 'offline';
  pricing: {
    video: number; // per minute
    audio: number; // per minute
  };
  certifications: string[];
  bio: string;
  successRate: number; // percentage of successfully completed sessions
}

interface InterpreterSelectionProps {
  language: string;
  urgency: 'low' | 'normal' | 'high';
  sessionType: 'video' | 'audio';
  onSelectInterpreter: (interpreter: InterpreterProfile) => void;
  onRequestAny: () => void; // Fallback to broadcast system
}

// Mock data - In production, this would come from your API
const mockInterpreters: InterpreterProfile[] = [
  {
    id: 'int_001',
    name: 'Maria Rodriguez',
    avatar: '/avatars/maria.jpg',
    rating: 4.9,
    totalSessions: 1247,
    languages: [
      { code: 'es', name: 'Spanish', proficiency: 'native' },
      { code: 'en', name: 'English', proficiency: 'fluent' }
    ],
    specializations: ['Medical', 'Legal', 'Business'],
    location: 'Madrid, Spain',
    timezone: 'CET',
    responseTime: 12,
    availability: 'online',
    pricing: { video: 0.75, audio: 0.50 },
    certifications: ['CCHI Certified', 'Medical Interpreter'],
    bio: 'Certified medical interpreter with 8+ years of experience in healthcare settings.',
    successRate: 98.5
  },
  {
    id: 'int_002', 
    name: 'Ahmed Hassan',
    rating: 4.8,
    totalSessions: 892,
    languages: [
      { code: 'ar', name: 'Arabic', proficiency: 'native' },
      { code: 'en', name: 'English', proficiency: 'professional' }
    ],
    specializations: ['Legal', 'Government', 'Immigration'],
    location: 'Cairo, Egypt',
    timezone: 'EET',
    responseTime: 8,
    availability: 'online',
    pricing: { video: 0.65, audio: 0.45 },
    certifications: ['Court Interpreter', 'Immigration Specialist'],
    bio: 'Legal interpreter specializing in immigration and government proceedings.',
    successRate: 96.2
  },
  {
    id: 'int_003',
    name: 'Sarah Chen',
    rating: 4.7,
    totalSessions: 567,
    languages: [
      { code: 'zh', name: 'Chinese (Mandarin)', proficiency: 'native' },
      { code: 'en', name: 'English', proficiency: 'fluent' }
    ],
    specializations: ['Business', 'Technology', 'Finance'],
    location: 'San Francisco, CA',
    timezone: 'PST',
    responseTime: 15,
    availability: 'busy',
    pricing: { video: 0.85, audio: 0.60 },
    certifications: ['Business Interpreter', 'Financial Services'],
    bio: 'Business interpreter with expertise in technology and finance sectors.',
    successRate: 97.1
  }
];

export default function InterpreterSelection({
  language,
  urgency,
  sessionType,
  onSelectInterpreter,
  onRequestAny
}: InterpreterSelectionProps) {
  const [interpreters, setInterpreters] = useState<InterpreterProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');

  useEffect(() => {
    // Simulate API call to get interpreters for the selected language
    const fetchInterpreters = async () => {
      setLoading(true);
      
      // Filter interpreters by language
      const filteredInterpreters = mockInterpreters.filter(interpreter =>
        interpreter.languages.some(lang => lang.code === language)
      );
      
      // Sort by availability and rating
      const sortedInterpreters = filteredInterpreters.sort((a, b) => {
        // Online interpreters first
        if (a.availability === 'online' && b.availability !== 'online') return -1;
        if (b.availability === 'online' && a.availability !== 'online') return 1;
        
        // Then by rating
        return b.rating - a.rating;
      });

      setTimeout(() => {
        setInterpreters(sortedInterpreters);
        setLoading(false);
      }, 1000);
    };

    fetchInterpreters();
  }, [language]);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'away': return 'bg-orange-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'online': return 'Available now';
      case 'busy': return 'In session';
      case 'away': return 'Away';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Finding available interpreters...</p>
        </div>
      </div>
    );
  }

  if (interpreters.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Interpreters Available</h3>
          <p className="text-muted-foreground mb-4">
            No interpreters are currently available for {language}. You can:
          </p>
          <div className="space-y-2">
            <Button onClick={onRequestAny} className="w-full">
              <Zap className="w-4 h-4 mr-2" />
              Send Broadcast Request
            </Button>
            <p className="text-xs text-muted-foreground">
              We'll notify all interpreters and connect you with the first available one
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Available Interpreters</h2>
          <p className="text-muted-foreground">
            {interpreters.length} interpreters available for {language}
          </p>
        </div>
        
        <Button variant="outline" onClick={onRequestAny}>
          <Zap className="w-4 h-4 mr-2" />
          Quick Connect
        </Button>
      </div>

      <div className="grid gap-4">
        {interpreters.map((interpreter) => (
          <Card key={interpreter.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {/* Avatar and Status */}
                <div className="relative">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={interpreter.avatar} alt={interpreter.name} />
                    <AvatarFallback>
                      {interpreter.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background ${getAvailabilityColor(interpreter.availability)}`}></div>
                </div>

                {/* Main Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{interpreter.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium ml-1">{interpreter.rating}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          ({interpreter.totalSessions} sessions)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${getAvailabilityColor(interpreter.availability)}`}></div>
                      {getAvailabilityText(interpreter.availability)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {interpreter.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      ~{interpreter.responseTime}s response
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {interpreter.languages.map((lang) => (
                      <Badge key={lang.code} variant="secondary" className="text-xs">
                        <Globe className="w-3 h-3 mr-1" />
                        {lang.name}
                        <span className="ml-1 text-xs opacity-75">
                          ({lang.proficiency})
                        </span>
                      </Badge>
                    ))}
                  </div>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {interpreter.specializations.map((spec) => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        {spec}
                      </Badge>
                    ))}
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-muted-foreground mb-3">
                    {interpreter.bio}
                  </p>

                  {/* Success Rate */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xs font-medium">Success Rate:</span>
                    <Progress value={interpreter.successRate} className="flex-1 h-2" />
                    <span className="text-xs font-medium">{interpreter.successRate}%</span>
                  </div>

                  {/* Pricing and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Video className="w-4 h-4 mr-1" />
                        ${interpreter.pricing.video}/min
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        ${interpreter.pricing.audio}/min
                      </div>
                    </div>

                    <Button
                      onClick={() => onSelectInterpreter(interpreter)}
                      disabled={interpreter.availability === 'offline'}
                      className="ml-4"
                    >
                      {interpreter.availability === 'online' ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Select
                        </>
                      ) : interpreter.availability === 'busy' ? (
                        <>
                          <Clock className="w-4 h-4 mr-2" />
                          Request
                        </>
                      ) : (
                        'Unavailable'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fallback Option */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Can't find the right interpreter?</h4>
              <p className="text-sm text-muted-foreground">
                Send a broadcast request to all available interpreters
              </p>
            </div>
            <Button variant="outline" onClick={onRequestAny}>
              <Zap className="w-4 h-4 mr-2" />
              Broadcast Request
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
