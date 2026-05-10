# SmartAttendance AI — Phase 5 Implementation Plan

## Project
**SmartAttendance AI**  
Phase 5 — Geofencing Engine & Location Verification System

---

# 1. Phase 5 Objective

Phase 5 focuses ONLY on:

- geofencing engine
- GPS validation
- classroom radius validation
- location eligibility
- geospatial utilities
- location verification workflow
- browser geolocation integration
- location security validation
- attendance location restrictions

This phase does NOT implement:
- face recognition
- analytics
- reports
- notifications

---

# 2. Why Phase 5 Is Important

The system must ensure:
> students can only mark attendance inside the institution perimeter.

Without geofencing:
- proxy attendance becomes easy
- remote attendance becomes possible
- institutional validation weakens

---

# 3. Phase 5 Deliverables

At end of Phase 5:

- browser geolocation working
- classroom radius validation working
- geofence verification engine operational
- location APIs functional
- attendance location validation active
- classroom coordinate system operational
- geospatial utilities implemented

---

# 4. Core Geofencing Workflow

```text
Student Opens Attendance Page
          ↓
Browser Requests GPS Permission
          ↓
Coordinates Retrieved
          ↓
Backend Receives Coordinates
          ↓
System Fetches Classroom Coordinates
          ↓
Distance Calculation Performed
          ↓
Inside Radius?
    YES → Allow Attendance
    NO  → Reject Attendance
```

---

# 5. Modules Included

```text
geofence/
location-validation/
gps-utils/
classroom-location/
```

---

# 6. Browser Geolocation Integration

## Frontend API

Use:
```javascript
navigator.geolocation.getCurrentPosition()
```

---

# 7. Browser Geolocation Flow

```text
Browser Requests GPS
        ↓
User Grants Permission
        ↓
Latitude & Longitude Retrieved
        ↓
Coordinates Sent To Backend
```

---

# 8. Geolocation Request Example

```javascript
navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log(position.coords.latitude)
    console.log(position.coords.longitude)
  },
  (error) => {
    console.error(error)
  },
  {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  }
)
```

---

# 9. Classroom Coordinates

Every classroom stores:

```text
latitude
longitude
allowedRadius
```

---

# 10. Recommended Radius

Recommended:

```text
150m → 250m
```

Reason:
- indoor GPS inaccuracies
- mobile GPS drift
- browser precision limitations

---

# 11. Geofence Validation Engine

## Purpose

Determine:
> is student inside valid classroom perimeter?

---

# 12. Distance Calculation Strategy

Use:
- Haversine Formula

Purpose:
- calculate earth distance between coordinates

---

# 13. Haversine Formula

Distance calculation concept:

```text
Earth Radius
+ Latitude Difference
+ Longitude Difference
→ Distance In Meters
```

---

# 14. Geofence Utility Layer

## geofence.utils.ts

Responsibilities:
- coordinate validation
- distance calculation
- radius checks
- location formatting

---

# 15. Geofence Validation Flow

```text
Student Coordinates
         ↓
Fetch Classroom Coordinates
         ↓
Calculate Distance
         ↓
Compare Against Radius
         ↓
Inside Radius?
```

---

# 16. Validation Rules

## Valid Attendance Requires

```text
Distance <= Allowed Radius
```

Example:

```text
Distance = 45m
Radius = 150m
→ VALID
```

---

# 17. Invalid Location Example

```text
Distance = 500m
Radius = 150m
→ REJECT
```

---

# 18. Geofence Module Structure

```text
geofence/
│
├── geofence.controller.ts
├── geofence.service.ts
├── geofence.repository.ts
├── geofence.routes.ts
├── geofence.validation.ts
├── geofence.utils.ts
├── geofence.constants.ts
└── geofence.types.ts
```

---

# 19. Attendance Integration

Attendance marking now requires:

```text
Valid Session
AND
Valid Geofence
AND
No Duplicate Attendance
```

---

# 20. Geofence APIs

## Verify Location

```http
POST /api/v1/geofence/verify
```

Request:

```json
{
  "timetableId": 12,
  "latitude": 15.4589,
  "longitude": 75.0078
}
```

---

# 21. Geofence Verification Response

## Success

```json
{
  "success": true,
  "message": "Location verified",
  "data": {
    "distance": 42,
    "allowedRadius": 150
  }
}
```

---

# 22. Failed Verification Response

```json
{
  "success": false,
  "message": "Outside classroom radius"
}
```

---

# 23. Geofence Validation Layer

## geofence.validation.ts

Responsibilities:
- validate coordinates
- validate timetable IDs
- validate latitude/longitude ranges

---

# 24. Coordinate Validation Rules

## Latitude

```text
-90 → +90
```

---

## Longitude

```text
-180 → +180
```

---

# 25. Zod Coordinate Schema

```ts
import { z } from "zod"

export const geofenceSchema = z.object({
  timetableId: z.number(),

  latitude: z.number()
    .min(-90)
    .max(90),

  longitude: z.number()
    .min(-180)
    .max(180)
})
```

---

# 26. Location Security Considerations

## Important

GPS can be spoofed.

This system:
- reduces cheating
- does NOT eliminate advanced spoofing

---

# 27. Production-Grade Improvements (Future)

Future improvements:
- WiFi triangulation
- institutional network validation
- device fingerprinting
- GPS spoof detection

Not required for capstone MVP.

---

# 28. Attendance Database Update

Add fields:

```prisma
latitude        Decimal?
longitude       Decimal?

geoVerified     Boolean @default(false)

distanceMeters  Float?
```

---

# 29. Geofence Verification Flow

```text
Attendance Request
        ↓
Extract Coordinates
        ↓
Fetch Timetable
        ↓
Fetch Classroom
        ↓
Calculate Distance
        ↓
Verify Radius
        ↓
Update Attendance Record
```

---

# 30. Performance Optimization

## Important

Avoid:
- repeated classroom queries
- repeated distance calculations

---

## Recommended

- indexed timetable lookups
- lightweight calculations
- reusable utility methods

---

# 31. Classroom Coordinate Management

## Admin Responsibilities

Admins can:
- set classroom coordinates
- configure radius
- update geofence settings

---

# 32. Classroom APIs

## Update Classroom Coordinates

```http
PATCH /api/v1/classrooms/:id/location
```

---

# 33. Request Example

```json
{
  "latitude": 15.4590,
  "longitude": 75.0081,
  "allowedRadius": 200
}
```

---

# 34. GPS Accuracy Handling

## Important

GPS may return:

```text
accuracy = 5m
accuracy = 100m
```

---

# 35. Recommended Validation

Reject if:

```text
accuracy > 150m
```

because:
location becomes unreliable.

---

# 36. Browser GPS Errors

Possible browser errors:

```text
PermissionDenied
PositionUnavailable
Timeout
```

Frontend must handle all.

---

# 37. Frontend UX Flow

```text
Request Location Permission
        ↓
Show Loading State
        ↓
Retrieve Coordinates
        ↓
Send To Backend
        ↓
Display Verification Result
```

---

# 38. Security Rules

Must prevent:
- fake coordinate payloads
- invalid timetable access
- unauthorized location verification

---

# 39. Rate Limiting

Recommended:

```text
10 location requests / minute
```

per student.

---

# 40. Logging Strategy

Every geofence validation should log:

```text
LOCATION_VERIFIED
LOCATION_REJECTED
GPS_PERMISSION_DENIED
```

---

# 41. Scalability Considerations

Target:
- 100+ simultaneous location validations

---

# 42. Concurrency Strategy

Geofence validation is lightweight because:
- calculations are mathematical only
- no heavy processing involved

This scales efficiently.

---

# 43. Database Optimization

Recommended indexes:

```sql
INDEX(classroom_id)
INDEX(geo_verified)
INDEX(marked_at)
```

---

# 44. Error Types

Common errors:

```text
InvalidCoordinatesError
OutsideGeofenceError
LocationPermissionDeniedError
GPSAccuracyTooLowError
```

---

# 45. Testing Strategy

## Important Test Cases

### Valid Location
- inside radius

### Invalid Location
- outside radius

### GPS Errors
- denied permission
- timeout
- low accuracy

### Security
- invalid coordinates
- unauthorized requests

---

# 46. API Testing Tools

Use:
- Postman
- Thunder Client
- Browser Testing

---

# 47. Example Geofence Workflow

```text
Student Opens Attendance
         ↓
GPS Permission Granted
         ↓
Coordinates Retrieved
         ↓
Backend Calculates Distance
         ↓
Inside Classroom Radius
         ↓
Attendance Allowed
```

---

# 48. Engineering Notes

The geofence engine must be:
- lightweight
- fast
- mathematically accurate
- validation-safe

because:
every attendance request depends on it.

---

# 49. Completion Checklist

## Phase 5 Complete If:

- browser GPS working
- geofence validation working
- radius validation operational
- classroom coordinates managed
- attendance integration working
- validation rules active
- GPS errors handled
- indexes optimized

---

# 50. Next Phase Preview

## Phase 6

Will implement:
- face recognition engine
- face descriptor generation
- face matching
- liveness detection
- biometric verification workflow
- AI attendance validation
