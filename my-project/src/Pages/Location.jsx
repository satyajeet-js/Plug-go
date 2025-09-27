// Core React hooks
import { useState, useEffect, useCallback } from 'react';
// Google Maps React bindings
import { GoogleMap, Marker, InfoWindow, Circle, useJsApiLoader } from '@react-google-maps/api';
// Static seed data for EV stations
import customStations from '../customStations.json';


function Product() {
  // Map instance (for programmatic panning/zooming)
  const [map, setMap] = useState(null);
  // Currently selected station (for InfoWindow and highlighting a card)
  const [selectedPlace, setSelectedPlace] = useState(null);
  // Live device location { lat, lng }
  const [currentLocation, setCurrentLocation] = useState(null);
  // Whether the InfoWindow is visible
  const [showInfo, setShowInfo] = useState(false);
  // Search radius in km around currentLocation
  const [radius, setRadius] = useState(20);
  // UI-friendly geolocation error message
  const [locationError, setLocationError] = useState('');
  // Status filter: 'all' | 'available' | 'busy' | 'maintenance'
  const [activeFilter, setActiveFilter] = useState('all');
  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    station: '',
    date: '',
    time: '',
    duration: '2'
  });


  // Load Google Maps JS API (key comes from your Vite env: VITE_GOOGLE_MAPS_KEY)
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: ['places'],
  });


  // Reserved in case you bring back API-provided stations
  const evChargingStations = [];
  // Combine any dynamic stations with your static JSON file
  const allEvStations = [...evChargingStations, ...customStations];


  // Generate synthetic station metadata (status, chargers, amenities, etc.)
  // based on station name/address so the UI feels realistic.
  const generateLocationBasedAmenities = (stationName, address) => {
    const statuses = ['available', 'busy', 'maintenance'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const chargerCounts = [4, 6, 8, 12, 16];
    const maxPowers = ['50kW', '150kW', '250kW', '350kW'];


    let amenities = [];
    // Simple rules that infer amenities by location keywords
    if (address.includes('Mall') || address.includes('Westend') || address.includes('Amanora')) {
      amenities = ['Food Court', 'Shopping', 'Restrooms', 'WiFi', 'ATM', 'Cinema'];
    } else if (address.includes('Hotel') || address.includes('Ginger')) {
      amenities = ['Restaurant', 'WiFi', 'AC Waiting Area', 'Restrooms', 'Room Service', 'Parking'];
    } else if (address.includes('IT Park') || address.includes('Cybercity')) {
      amenities = ['Cafeteria', 'WiFi', 'Security', 'Parking', 'ATM', 'Medical'];
    } else if (address.includes('Expressway') || address.includes('Highway')) {
      amenities = ['Dhaba', 'Fuel Station', 'Restrooms', 'Parking', 'Snacks', 'Mechanic'];
    } else if (stationName.includes('Tata Motors')) {
      amenities = ['Service Center', 'Showroom', 'WiFi', 'Waiting Lounge', 'Refreshments', 'Parking'];
    } else if (stationName.includes('ChargeZone')) {
      if (address.includes('Koregaon Park')) {
        amenities = ['Cafe', 'Restaurants', 'WiFi', 'Shopping', 'ATM', 'Garden'];
      } else if (address.includes('Shivajinagar')) {
        amenities = ['Market', 'Restaurants', 'Medical Store', 'WiFi', 'ATM', 'Bus Stop'];
      } else if (address.includes('Viman Nagar')) {
        amenities = ['Airport Shuttle', 'WiFi', 'Restaurants', 'ATM', 'Parking', 'Hotels'];
      } else {
        amenities = ['Local Shops', 'Tea Stall', 'WiFi', 'ATM', 'Parking', 'Restrooms'];
      }
    } else if (stationName.includes('BP Pulse')) {
      amenities = ['Premium Lounge', 'Starbucks', 'WiFi', 'Clean Restrooms', 'Valet Parking', 'Concierge'];
    } else if (address.includes('Aundh') || address.includes('Baner')) {
      amenities = ['Local Restaurants', 'Grocery Store', 'WiFi', 'Park Nearby', 'ATM', 'Pharmacy'];
    } else if (address.includes('Hadapsar') || address.includes('Bhosari')) {
      amenities = ['Canteen', 'Parking', 'Security', 'Restrooms', 'Vending Machine', 'Workshop'];
    } else {
      amenities = ['WiFi', 'Restrooms', 'Parking', 'Security', 'ATM', 'Local Shops'];
    }


    return {
      status,
      chargers: chargerCounts[Math.floor(Math.random() * chargerCounts.length)],
      // Only show "available" count when status is available
      available: status === 'available' ? Math.floor(Math.random() * 8) + 2 : 0,
      maxPower: maxPowers[Math.floor(Math.random() * maxPowers.length)],
      amenities,
    };
  };


  // Haversine formula to compute distance (km) between two lat/lng points
  const distanceInKm = (lat1, lng1, lat2, lng2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };


  // Build the station list:
  // - If we have a current location, filter by radius and compute distance.
  // - Otherwise, just attach generated metadata.
  const processedStations = currentLocation
    ? allEvStations
        .filter((s) => distanceInKm(currentLocation.lat, currentLocation.lng, s.lat, s.lng) <= radius)
        .map((s) => ({
          ...s,
          ...generateLocationBasedAmenities(s.name, s.address),
          distance: distanceInKm(currentLocation.lat, currentLocation.lng, s.lat, s.lng),
        }))
        .sort((a, b) => a.distance - b.distance)
    : allEvStations.map((s) => ({
        ...s,
        ...generateLocationBasedAmenities(s.name, s.address),
      }));


  // Apply both status filter and search filter
  const filteredStations = processedStations.filter((s) => {
    // Status filter
    let passesStatusFilter = true;
    if (activeFilter === 'available') passesStatusFilter = s.status === 'available';
    else if (activeFilter === 'busy') passesStatusFilter = s.status === 'busy';
    else if (activeFilter === 'maintenance') passesStatusFilter = s.status === 'maintenance';
    
    // Search filter (case-insensitive, searches both name and address)
    let passesSearchFilter = true;
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      passesSearchFilter = 
        s.name.toLowerCase().includes(searchLower) || 
        s.address.toLowerCase().includes(searchLower);
    }
    
    return passesStatusFilter && passesSearchFilter;
  });


  // Custom blue SVG marker icon for EV stations
  const createEVStationIcon = () => {
    return {
      url:
        'data:image/svg+xml;base64,' +
        btoa(`
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="19" fill="#2563eb" stroke="#ffffff" stroke-width="2"/>
          <circle cx="20" cy="20" r="15" fill="#ffffff"/>
          <path d="M24 14H19V19H15L22 26V22H17L24 14Z" fill="#2563eb"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(35, 35),
      anchor: new window.google.maps.Point(17.5, 35),
    };
  };


  // Start continuous geolocation tracking
  // - Updates currentLocation
  // - Pans the map to new location if map is ready
  // - Retries on transient errors
  const startLocationTracking = useCallback(() => {
    const options = { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 };


    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const newLocation = { lat: latitude, lng: longitude };
        setCurrentLocation(newLocation);
        setLocationError('');
        if (map) map.panTo(newLocation);
        console.log(`LIVE: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (±${accuracy.toFixed(0)}m)`);
      },
      (error) => {
        let msg = '';
        switch (error.code) {
          case error.PERMISSION_DENIED: msg = 'Location access denied.'; break;
          case error.POSITION_UNAVAILABLE: msg = 'Location unavailable.'; break;
          case error.TIMEOUT:
            msg = 'Location timeout. Retrying...'; setTimeout(() => startLocationTracking(), 2000); break;
          default:
            msg = 'Unknown error. Retrying...'; setTimeout(() => startLocationTracking(), 2000); break;
        }
        setLocationError(msg);
      },
      options
    );


    // Get an initial fix quickly (in addition to the watch)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setCurrentLocation({ lat: coords.latitude, lng: coords.longitude }),
      () => {},
      options
    );


    // Cleanup the watch when component unmounts
    return () => watchId && navigator.geolocation.clearWatch(watchId);
  }, [map]);


  // UPDATED: Fixed requestLocationPermission function
  const requestLocationPermission = useCallback(async () => {
    try {
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by your browser');
        return;
      }
      
      // For retry scenarios, directly attempt geolocation instead of checking permissions
      // This will trigger the browser's permission dialog if needed
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setCurrentLocation({ lat: coords.latitude, lng: coords.longitude });
          setLocationError('');
          if (map) map.panTo({ lat: coords.latitude, lng: coords.longitude });
          startLocationTracking();
        },
        (error) => {
          let msg = '';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              msg = 'Location access denied. Please enable location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              msg = 'Location unavailable. Please check your GPS/network connection.';
              break;
            case error.TIMEOUT:
              msg = 'Location request timed out. Please try again.';
              break;
            default:
              msg = 'Unable to get location. Please try again.';
              break;
          }
          setLocationError(msg);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    } catch {
      // Fallback: try direct geolocation access
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setCurrentLocation({ lat: coords.latitude, lng: coords.longitude });
          setLocationError('');
          if (map) map.panTo({ lat: coords.latitude, lng: coords.longitude });
          startLocationTracking();
        },
        () => {
          setLocationError('Unable to access location. Please check your browser settings.');
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    }
  }, [map, startLocationTracking]);


  // Kick off permission request on mount
  useEffect(() => { requestLocationPermission(); }, [requestLocationPermission]);


  // If map initializes before we have a location, try requesting again
  useEffect(() => {
    if (map && !currentLocation) requestLocationPermission();
  }, [map, currentLocation, requestLocationPermission]);


  // Periodic refresh every 30s to keep location fresh even if watch stalls
  useEffect(() => {
    const id = setInterval(() => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => setCurrentLocation({ lat: coords.latitude, lng: coords.longitude }),
        () => {},
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    }, 30000);
    return () => clearInterval(id);
  }, []);


  // Store map instance for later panning/zooming
  const onLoad = (m) => setMap(m);


  // Map click dismisses the InfoWindow
  const handleMapClick = () => { setSelectedPlace(null); setShowInfo(false); };


  // Marker click: select the station, open info, center/zoom
  const handleStationClick = (s) => { setSelectedPlace(s); setShowInfo(true); map.panTo(s); map.setZoom(16); };


  // Card click mirrors marker click behavior
  const handleCardClick = (s) => { setSelectedPlace(s); setShowInfo(true); if (map) { map.panTo(s); map.setZoom(16); } };


  // Open Google Maps native directions externally
  const openInGoogleMaps = (s) => window.open(`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`, '_blank');


  // Handle booking modal
  const handleBookNow = (station) => {
    setSelectedStation(station);
    setBookingForm({
      ...bookingForm,
      station: station.name
    });
    setShowBookingModal(true);
  };


  // Close booking modal
  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedStation(null);
  };


  // Handle form submission
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    alert(`Booking confirmed!\nStation: ${bookingForm.station}\nDate: ${bookingForm.date}\nTime: ${bookingForm.time}\nDuration: ${bookingForm.duration} hours`);
    closeBookingModal();
  };


  // Handle form input changes
  const handleFormChange = (field, value) => {
    setBookingForm({
      ...bookingForm,
      [field]: value
    });
  };


  // While Google Maps API is loading, show a simple branded loader
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <h4 className="mt-4 text-gray-700 font-semibold">Loading EV Charging Network...</h4>
          <p className="text-gray-500">Requesting your live location...</p>
        </div>
      </div>
    );
  }


  // Main UI
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header hero with search + filters + radius slider */}
      <div className="bg-white py-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Find Locations</h1>
          <p className="text-lg text-gray-500 mb-6">
            Discover charging stations near you with real-time availability
          </p>


          {/* Search box and status filters */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
            {/* Enhanced search input with clear button */}
            <div className="w-full md:w-1/2 lg:w-1/3">
              <div className="flex items-center rounded-lg bg-gray-100 ring-1 ring-gray-200 focus-within:ring-blue-500">
                <div className="px-3 text-gray-400">🔍</div>
                <input
                  type="text"
                  placeholder="Search by location name or address"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent py-2.5 pr-3 text-sm text-gray-700 outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>


            {/* Status filters with counts */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white ring-1 ring-gray-300 text-gray-700'}`}
                onClick={() => setActiveFilter('all')}
              >
                All Locations ({processedStations.length})
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeFilter === 'available' ? 'bg-green-600 text-white' : 'bg-white ring-1 ring-gray-300 text-gray-700'}`}
                onClick={() => setActiveFilter('available')}
              >
                Available ({processedStations.filter(s => s.status === 'available').length})
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeFilter === 'busy' ? 'bg-amber-500 text-white' : 'bg-white ring-1 ring-gray-300 text-gray-700'}`}
                onClick={() => setActiveFilter('busy')}
              >
                Busy ({processedStations.filter(s => s.status === 'busy').length})
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeFilter === 'maintenance' ? 'bg-red-600 text-white' : 'bg-white ring-1 ring-gray-300 text-gray-700'}`}
                onClick={() => setActiveFilter('maintenance')}
              >
                Maintenance ({processedStations.filter(s => s.status === 'maintenance').length})
              </button>
            </div>
          </div>


          {/* Radius slider controlling Circle radius and list filtering */}
          <div className="mt-6 mx-auto w-full md:w-2/3 lg:w-1/2">
            <div className="bg-white rounded-xl shadow ring-1 ring-gray-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Search Radius</span>
                <span className="inline-flex items-center rounded-full bg-blue-600 text-white text-xs px-2 py-0.5">{radius} km</span>
              </div>
              <input
                type="range"
                min="5" max="20" step="1" value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full accent-green-600 mt-2"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>5km</span><span>20km</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* UPDATED: Enhanced error message with improved Tailwind CSS styling */}
      {locationError && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-start justify-between gap-4">
              {/* Error Content */}
              <div className="flex items-start gap-3 flex-1">
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {/* Error Text */}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-red-800">
                    <span className="font-semibold">Location Access Required</span>
                  </div>
                  <div className="mt-1 text-sm text-red-700">
                    {locationError}
                  </div>
                  
                  {/* Enhanced help text for denied permissions */}
                  {locationError.includes('denied') && (
                    <div className="mt-2 p-3 bg-red-100/50 border border-red-200 rounded-lg">
                      <div className="text-xs text-red-800 font-medium mb-1">
                        💡 How to enable location access:
                      </div>
                      <ul className="text-xs text-red-700 space-y-1 ml-2">
                        <li>• Click the location/lock icon in your browser's address bar</li>
                        <li>• Select "Allow" for location permissions</li>
                        <li>• Or go to Settings → Privacy → Site Settings → Location → Allow</li>
                      </ul>
                    </div>
                  )}
                  
                  {/* Help text for other errors */}
                  {(locationError.includes('unavailable') || locationError.includes('timeout')) && (
                    <div className="mt-2 p-3 bg-red-100/50 border border-red-200 rounded-lg">
                      <div className="text-xs text-red-800 font-medium mb-1">
                        🔧 Troubleshooting tips:
                      </div>
                      <ul className="text-xs text-red-700 space-y-1 ml-2">
                        <li>• Check if GPS/location services are enabled on your device</li>
                        <li>• Ensure you have a stable internet connection</li>
                        <li>• Try refreshing the page and allowing location access</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex-shrink-0 flex gap-2">
                {/* Retry Button with enhanced styling */}
                <button
                  onClick={requestLocationPermission}
                  className="group relative inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-95"
                >
                  {/* Retry icon with animation */}
                  <svg 
                    className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Try Again</span>
                  
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                </button>
                
                {/* Dismiss Button with enhanced styling */}
                <button
                  onClick={() => setLocationError('')}
                  className="group relative inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-red-700 hover:text-red-800 text-sm font-medium rounded-lg border border-red-300 hover:border-red-400 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-95"
                >
                  {/* Close icon */}
                  <svg 
                    className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Dismiss</span>
                  
                  {/* Subtle highlight effect */}
                  <div className="absolute inset-0 rounded-lg bg-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Map section */}
      <div className="py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-[60vh] w-full rounded-xl shadow ring-1 ring-gray-200 overflow-hidden">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={currentLocation || { lat: 18.5204, lng: 73.8567 }} // Pune fallback
              zoom={currentLocation ? 13 : 11}
              onLoad={onLoad}
              onClick={handleMapClick}
            >
              {/* Live location marker + radius circle */}
              {currentLocation && (
                <>
                  <Marker
                    position={currentLocation}
                    icon={{
                      url:
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiMwMDdCRkYiIGZpbGwtb3BhY2l0eT0iMC4zIiBzdHJva2U9IiMwMDdCRkYiIHN0cm9rZS13aWR0aD0iMyIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSI4IiBmaWxsPSIjMDA3QkZGIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjMiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+",
                      scaledSize: new window.google.maps.Size(40, 40),
                    }}
                    zIndex={1000}
                  />
                  <Circle
                    center={currentLocation}
                    radius={radius * 1000}
                    options={{
                      fillColor: '#2563eb',
                      fillOpacity: 0.08,
                      strokeColor: '#2563eb',
                      strokeOpacity: 0.4,
                      strokeWeight: 2,
                    }}
                  />
                </>
              )}


              {/* Station markers */}
              {filteredStations.map((s, i) => (
                <Marker key={i} position={s} icon={createEVStationIcon()} onClick={() => handleStationClick(s)} />
              ))}


              {/* Station popup */}
              {showInfo && selectedPlace && selectedPlace.name && (
                <InfoWindow position={selectedPlace} onCloseClick={() => setShowInfo(false)}>
                  <div className="min-w-[280px] max-w-[320px] p-2">
                    <div className="flex items-start justify-between mb-2">
                      <h6 className="font-semibold text-blue-600">{selectedPlace.name}</h6>
                      <span className={`px-2 py-0.5 rounded text-xs ${selectedPlace.status === 'available' ? 'bg-green-600 text-white' : selectedPlace.status === 'busy' ? 'bg-amber-400 text-gray-900' : 'bg-red-600 text-white'}`}>
                        {selectedPlace.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">📍 {selectedPlace.address}</p>
                    <div className="grid grid-cols-2 gap-2 mb-2 text-center">
                      <div>
                        <div className="font-semibold text-green-600">{selectedPlace.available || selectedPlace.chargers}</div>
                        <div className="text-[11px] text-gray-500">Chargers</div>
                      </div>
                      <div>
                        <div className="font-semibold text-blue-600">{selectedPlace.maxPower}</div>
                        <div className="text-[11px] text-gray-500">Max Power</div>
                      </div>
                    </div>
                    {selectedPlace.distance && (
                      <div className="bg-blue-50 text-blue-900 rounded px-2 py-1 text-center text-xs mb-2">
                        {selectedPlace.distance.toFixed(1)} km • {Math.ceil(selectedPlace.distance * 2)} min drive
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => openInGoogleMaps(selectedPlace)} className="flex-1 px-3 py-2 rounded-md bg-blue-600 text-white text-xs font-medium">
                        Get Directions
                      </button>
                      <button onClick={() => handleBookNow(selectedPlace)} className="px-3 py-2 rounded-md ring-1 ring-blue-600 text-blue-600 text-xs font-medium">
                        Book Now
                      </button>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        </div>
      </div>


      {/* Card list with status, specs, distance and quick actions */}
      <div className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">{filteredStations.length} Locations Found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm ? (
                <>Showing results for "<strong>{searchTerm}</strong>" {activeFilter !== 'all' && `filtered by ${activeFilter}`}</>
              ) : (
                activeFilter === 'all' ? 'Showing all stations' : `Showing results filtered by ${activeFilter}`
              )}
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStations.map((s, i) => (
              <div
                key={i}
                onClick={() => handleCardClick(s)}
                className={`group rounded-xl bg-white ring-1 ring-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer ${selectedPlace?.name === s.name ? 'ring-2 ring-blue-600' : ''}`}
              >
                {/* Card header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">⚡</div>
                        <h5 className="font-semibold text-gray-900">{s.name}</h5>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">📍 {s.address}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs ${s.status === 'available' ? 'bg-green-600 text-white' : s.status === 'busy' ? 'bg-amber-400 text-gray-900' : 'bg-red-600 text-white'}`}>
                      {s.status}
                    </span>
                  </div>
                </div>


                {/* Card body */}
                <div className="p-4">
                  {/* Quick stats row */}
                  <div className="grid grid-cols-3 text-center text-xs mb-3">
                    <div>
                      <div className="font-semibold text-green-600">{s.available || s.chargers}</div>
                      <div className="text-gray-500">Chargers</div>
                    </div>
                    <div>
                      <div className="font-semibold text-blue-600">{s.maxPower}</div>
                      <div className="text-gray-500">Power</div>
                    </div>
                    <div>
                      {s.distance ? (
                        <>
                          <div className="font-semibold text-sky-600">{s.distance.toFixed(1)} km</div>
                          <div className="text-gray-500">Distance</div>
                        </>
                      ) : (
                        <>
                          <div className="font-semibold text-gray-400">--</div>
                          <div className="text-gray-500">Distance</div>
                        </>
                      )}
                    </div>
                  </div>


                  {/* Amenities badges (first 3 + count) */}
                  <div className="mb-3">
                    <div className="text-xs font-semibold text-gray-500">Amenities:</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {s.amenities && s.amenities.slice(0, 3).map((a, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px]">{a}</span>
                      ))}
                      {s.amenities && s.amenities.length > 3 && (
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-[11px]">
                          +{s.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>


                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); openInGoogleMaps(s); }}
                      className="flex-1 px-3 py-2 rounded-md bg-blue-600 text-white text-xs font-medium"
                    >
                      Get Directions
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleBookNow(s); }}
                      className="flex-1 px-3 py-2 rounded-md bg-green-600 text-white text-xs font-medium"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}


            {/* Enhanced empty state */}
            {filteredStations.length === 0 && (
              <div className="col-span-full">
                <div className="text-center rounded-xl ring-1 ring-gray-200 bg-amber-50 p-8">
                  <div className="text-5xl mb-3">🔎</div>
                  <h5 className="font-semibold text-gray-800">No stations found</h5>
                  <p className="text-sm text-gray-600">
                    {searchTerm ? (
                      <>No stations found matching "<strong>{searchTerm}</strong>"</>
                    ) : (
                      'No EV charging stations found with current filters'
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    Try {searchTerm ? 'a different search term or ' : ''}changing your filter options or increasing the search radius
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-3 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Glass Morphism Booking Modal */}
      {showBookingModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div 
            className="relative w-full max-w-md animate-[modalSlide_0.3s_ease-out]"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.85) 0%, rgba(59, 130, 246, 0.85) 100%)',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.25),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
            }}
          >
            {/* Close button */}
            <button
              onClick={closeBookingModal}
              className="absolute top-4 right-4 text-white/90 hover:text-white transition-colors"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>


            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">Book Your Charging Station</h2>
            </div>


            {/* Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              {/* Station Selection */}
              <div>
                <label className="block text-white/90 font-medium mb-3 drop-shadow-sm">
                  Select Charging Station:
                </label>
                <div className="relative">
                  <select
                    value={bookingForm.station}
                    onChange={(e) => handleFormChange('station', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
                    }}
                    required
                  >
                    <option value="">{selectedStation ? selectedStation.name : 'Select a station'}</option>
                    {filteredStations.map((station, index) => (
                      <option key={index} value={station.name}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>


              {/* Date Selection */}
              <div>
                <label className="block text-white/90 font-medium mb-2 drop-shadow-sm">
                  Select Date:
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => handleFormChange('date', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
                    }}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>


              {/* Time Selection */}
              <div>
                <label className="block text-white/90 font-medium mb-2 drop-shadow-sm">
                  Select Time:
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={bookingForm.time}
                    onChange={(e) => handleFormChange('time', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
                    }}
                    required
                  />
                </div>
              </div>


              {/* Duration Selection */}
              <div>
                <label className="block text-white/90 font-medium mb-2 drop-shadow-sm">
                  Select Duration (in hours):
                </label>
                <div className="relative">
                  <select
                    value={bookingForm.duration}
                    onChange={(e) => handleFormChange('duration', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
                    }}
                    required
                  >
                    <option value="0.5">30 minutes</option>
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                    <option value="6">6 hours</option>
                    <option value="8">8 hours</option>
                    <option value="12">12 hours</option>
                  </select>
                </div>
              </div>


              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 text-white transform hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                Book Now
              </button>
            </form>
          </div>
        </div>
      )}


      <style jsx>{`
        @keyframes modalSlide {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}


export default Product;
