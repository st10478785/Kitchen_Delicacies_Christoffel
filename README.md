# Kitchen Delicacies - Restaurant Management App

**ST10478785, Vishay Gosai**

Mobile App Scripting - MAST5112

[Kitchen Delicacies Logo](<./assets/Logo(2).jpeg>)

## Table of Contents

1. [Project Overview](#project-overview)
2. [App Structure](#app-structure)
3. [Features](#features)
4. [Technical Specifications](#technical-specifications)
5. [File Structure](#file-structure)
6. [Design System](#design-system)
7. [React Native Components](#react-native-components)
8. [Navigation](#navigation)
9. [Performance Optimization](#performance-optimization)
10. [Development Guidelines](#development-guidelines)
11. [Deployment Instructions](#deployment-instructions)
12. [ChangeLog] (#changelog)
13. [Resources] (#resources)

## Project Overview

Kitchen Delicacies is a comprehensive restaurant management application built with React Native. It's designed to streamline menu management, order processing and customer interactions for Chef Christoffel's culinary business. The app provides separate interfaces for administrators and guests with robust functionality for both user types.

**Mission**: To provide an intuitive, efficient digital solution for restaurant management that enhances both operational efficiency and customer experience.

**Target Audience**:

- Restaurant administrators and chefs
- Customers browsing menus and placing orders
- Staff managing inventory and availability

## App Structure

### Core Screens:

- **App** (`App.tsx`) - Helps with linking of the pages.
- **SplashScreen** (`SplashScreen.tsx`) - Initial authentication screen with admin login.
- **HomeScreenA** (`HomeScreenA.tsx`) - Admin dashboard with comprehensive management tools.
- **HomeScreenG** (`HomeScreenG.tsx`) - Guest view for menu browsing and ordering.
- **MenuManagementScreen** (`MenuManagementScreen.tsx`) - Detailed menu item management.
- **ProfileScreen** (`ProfileScreen.tsx`) - User profile and preferences management.
- **SettingsScreen** (`SettingsScreen.tsx`) - App configuration and settings.
- **Assets** (`Assets`) - Stores all the apps images.

## Features

### Admin Functionality

- **Menu Management**: Add, edit, delete and toggle availability of menu items.
- **Advanced Filtering**: Category, availability and search filtering.
- **Statistics Dashboard**: Real-time menu analytics and performance metrics.
- **Gallery Management**: Restaurant image gallery with preview functionality.
- **Inventory Control**: Track item availability and update status in real-time.

### Guest Functionality

- **Menu Browsing**: Filterable menu with detailed item information.
- **Shopping Cart**: Add or remove items from cart with persistent cart state.
- **Search & Discovery**: Advanced search across names, descriptions and ingredients.
- **Dietary Preferences**: Filter by dietary tags and preferences.
- **Order Management**: Cart summary and ordering workflow.

### Shared Features

- **Responsive Design**: Optimized for various mobile device sizes.
- **Modern UI/UX**: Smooth animations and intuitive navigation.
- **Real-time Updates**: Immediate reflection of menu changes.
- **Cross-platform Compatibility**: iOS and Android support.

## Technical Specifications

### Technology Stack

- **React Native**: Cross-platform mobile development.
- **TypeScript**: Type-safe development with interfaces.
- **Expo**: Development platform and build tools.
- **React Navigation**: Native stack navigation for screen management.

### Key Dependencies

- `@expo/vector-icons` - Comprehensive icon library.
- `expo-linear-gradient` - Gradient background components.
- `@react-navigation/native-stack` - Navigation solution.
- `react-native` - Core framework components.

## File Structure

```
src/
│
├── App.tsx                 # Used as navigation
├── SplashScreen.tsx        # Authentication and guest access
├── HomeScreenA.tsx         # Admin dashboard and management
├── HomeScreenG.tsx         # Guest menu browsing interface
├── MenuManagementScreen.tsx # All menu operations 
├── ProfileScreen.tsx       # User profile management
├── SettingsScreen.tsx      # App configuration settings
└── assets/                 # All local images
    ├── Logo(1).jpeg        # Admin logo
    ├── Logo(2).jpeg        # Guest logo
    └── gallery/            # Restaurant gallery images
        ├── interior.jpg
        ├── chef-cooking.jpg
        ├── ingredients.jpg
        ├── dining.jpg
        ├── desserts.jpg
        └── wine.jpg
```

## Design System

### Color Palette

#### Primary Colors

primary-blue: #0557ef

success-green: #06D6A0

warning-orange: #FF9E0A

error-red: #f0101b

#### Neutral Colors

white: #ffffff;

background-gradient: ['#ffffff', '#f0f4ff'];

text-dark: #222;

text-gray: #666;

### Typography Scale

- **Header 1**: 28px, Weight: 700
- **Header 2**: 24px, Weight: 700
- **Header 3**: 20px, Weight: 700
- **Body Large**: 18px, Weight: 700
- **Body Regular**: 16px, Weight: 400
- **Body Small**: 14px, Weight: 400
- **Caption**: 12px, Weight: 500

## React Native Components

### Core Component Architecture

#### 1. State Management

- **useState**: Local component state management
- **useMemo**: Optimized filtering and calculations
- **Modal Management**: Controlled visibility for forms and filters

### Key Component Features

#### Authentication System

- Password-protected admin access (Password: 2004)
- Guest access without authentication.
- Secure navigation between admin and guest views.

#### Menu Management

- **Operations**: Full create, read, update, delete functionality.
- **Bulk Actions**: Toggle availability for multiple items.
- **Advanced Filtering**: Multi-criteria filtering with search.
- **Real-time Statistics**: Dynamic calculation of menu metrics.

#### User Experience

- **Smooth Animations**: Fade and slide transitions and bouncing.
- **Form Validation**: Comprehensive input validation with error messages.
- **Accessibility**: Proper labeling and touch targets.

## Navigation

### Stack Navigation Structure

- **Splash Screen** → Admin Login or Guest Access
- **Admin Flow**: HomeA → Menu Management → Profile → Settings
- **Guest Flow**: HomeG → Full Menu → Profile → Settings
- **Cross-navigation**: Admin can switch to guest view and back

## Performance Optimization

### Memoization Strategies

- **useMemo**: For expensive calculations and filtering operations.
- **FlatList Optimization**: Key extraction and render optimization.

### Image Optimization

- Local image assets with appropriate resolutions.
- Efficient loading and caching strategies.
- Progressive image loading where applicable.

## Development Guidelines

### Code Standards

- **TypeScript**: Strict typing with comprehensive interfaces
- **Component Structure**: Functional components with hooks
- **Naming Conventions**: Descriptive variable and function names
- **File Organization**: Logical separation of concerns

### Best Practices

- **Error Handling**: Comprehensive validation and user feedback
- **User Experience**: Smooth transitions and loading states
- **Accessibility**: Proper labeling and touch targets

## Deployment Instructions

### Expo Deployment

1. **Build**:

- npx create-expo-app Kitchen_Delicacies_Christoffel --template blank-typescript
- cd Kitchen_Delicacies_Christoffel
- code .
- npx expo start

## Support

- **Developer**: Vishay Gosai (ST10478785)
- **Restaurant**: Kitchen Delicacies - Chef Christoffel
- **Contact**: Implementation-specific contact details

## Links

### Github  : https://github.com/st10478785/Kitchen_Delicacies_Christoffel

### YouTube : https://youtu.be/ke3TFez9Yss

## ChangeLog

### Major Features

- **Complete Menu Management System**
  - Full CRUD operations for menu items
  - Advanced filtering by category, availability and search
  - Real time statistics and analytics dashboard
  - Image management with device gallery integration

- **Dual User Interface**
  - Comprehensive admin dashboard with management tools
  - Guest friendly interface for menu browsing
  - Seamless switching between admin and guest views
  - Role based feature access

- **Enhanced User Experience**
  - Professional design system implementation
  - Smooth animations and transitions
  - Comprehensive form validation
  - Intuitive navigation patterns

### Key Implementations

- **Image Management System**
  - Expo Image Picker integration for device gallery access
  - Image selection and preview for menu items
  - Change image functionality with visual feedback
  - Permission handling for camera roll access

- **Advanced Analytics Dashboard**
  - Real time price calculations and averages
  - Price range display (min/max)
  - Average prices by course category
  - Most popular items highlighting system
  - Comprehensive menu statistics (total items, available count)

- **Shopping Cart System**
  - Add/remove items functionality for guests
  - Persistent cart state management
  - Cart summary with item counting
  - Availability-based cart restrictions
  - Visual cart badge indicators

- **Professional Navigation**
  - Bottom tab navigation with active states
  - Stack navigation for hierarchical flows
  - Modal navigation for forms and details
  - Cross-navigation between admin/guest views

### New Features

- **Comprehensive Gallery System**
  - Restaurant image gallery with categorized viewing
  - Modal image viewing with detailed information
  - Gallery preview on main dashboard
  - Categorized gallery items (Ambiance, Team, Quality, Food, Beverages)
  - Image grid layout with smooth interactions

- **Advanced Filtering System**
  - Multi-criteria filtering (category, availability, search)
  - Active filter display with clear visual tags
  - Search across multiple fields (name, description, ingredients)
  - Filter reset functionality with one click
  - Real-time filter results updating

- **Dietary Management System**
  - Dietary tags system for menu items
  - Dietary preference management in user profiles
  - Visual tag display with color coding
  - Comprehensive dietary options (Vegetarian, Vegan, Gluten-Free, etc.)
  - Tag-based filtering capabilities

### Technical Improvements

- **Advanced State Management**
  - Optimized filtering with useMemo hooks for performance
  - Efficient array operations for menu item management
  - Real-time state synchronization across components
  - Comprehensive error handling and user validation

- **Enhanced UI/UX Components**
  - Consistent bottom navigation across all screens
  - Improved modal designs with better layouts
  - Comprehensive empty states and loading indicators
  - Enhanced form layouts with better spacing
  - Professional card designs with shadow effects

- **TypeScript Enhancements**
  - Comprehensive interface definitions
  - Strict type checking throughout application
  - Better component prop typing
  - Improved code maintainability

### Foundation Features

- **Authentication & Access System**
  - Password-protected admin access (Password: 2004)
  - Guest access without authentication barriers
  - Secure navigation flow between screens
  - Professional splash screen with branding

- **Basic Menu Management**
  - Add new menu items with comprehensive information
  - Toggle item availability with visual indicators
  - Simple category filtering system
  - Basic search functionality across menu items
  - Delete items with confirmation dialogs

- **Navigation Architecture**
  - Complete stack navigation setup
  - Screen routing configuration
  - Basic bottom navigation implementation
  - Cross-screen navigation patterns
  - Modal presentation for forms

### Design System Implementation

- **Color Palette Establishment**
  - Primary colors: Blue (#0557ef), Green (#06D6A0), Orange (#FF9E0A), Red (#f0101b)
  - Neutral colors for text and backgrounds
  - Consistent gradient backgrounds

- **Typography Scale Definition**
  - Header sizes (28px, 24px, 20px)
  - Body text sizes (18px, 16px, 14px, 12px)
  - Consistent font weights throughout

- **Component Styling Foundation**
  - Border radius standards (8px, 12px, 16px)
  - Shadow and elevation system
  - Consistent spacing using 8px grid
  - Standard icon sizes and colors

### Project Foundation

- **Development Environment Setup**
  - React Native with TypeScript configuration
  - Expo development environment setup
  - Basic project structure and organization
  - Asset management and organization

- **Technical Architecture Planning**
  - Component architecture and structure planning
  - Navigation system design and implementation
  - State management approach decision
  - Development workflow establishment

## Technical Specifications

### Dependencies Added
- `expo-image-picker` - For device gallery access and image selection
- `@expo/vector-icons` - Comprehensive icon library
- `expo-linear-gradient` - Gradient background components
- `@react-navigation/native-stack` - Navigation solution
- `react-native` - Core framework components

### Performance Optimizations

- **Memoization**: useMemo hooks for expensive calculations
- **Efficient Filtering**: Optimized search and filter operations
- **FlatList Optimization**: Proper key extraction and rendering
- **Image Optimization**: Efficient loading and caching strategies

### Code Quality Features

- **TypeScript**: Full type safety with interfaces
- **Component Architecture**: Modular and reusable components
- **Error Handling**: Comprehensive validation and user feedback
- **Documentation**: Clear code comments and structure

## References

Baymard Institute (2025) Ecommerce Design Examples. Available at: https://baymard.com/ecommerce-design-examples (Accessed: 5 August 2025).

Font Awesome (no date) Search results for 'r'. Available at: https://fontawesome.com/search?o=r (Accessed: 1 October 2025).

Freepik (2025) New modern realistic front view black iPhone mockup isolated white mobile template vector. Available at: https://www.freepik.com/free-vector/new-modern-realistic-front-view-black-iphone-mockup-isolated-white-mobile-template-vector_33632328.htm#fromView=keyword&page=1&position=0&uuid=c00f978c-d906-47d3-ada5-0f3df4e8234c&query=Phone+Silhouette (Accessed: 1 August 2025).

JavaScript Mastery (2025) React Native Course for Beginners in 2025 | Build a Full Stack React Native App. Available at: https://youtu.be/f8Z9JyB2EIE?si=Uk57MO0HYxF_joMW (Accessed: between 1 and 20 August 2025).

Programming with Mosh (2023) React Tutorial for Beginners. Available at: https://youtu.be/SqcY0GlETPk?si=u9xWYPUc3rP1LEFz (Accessed: between 1 and 20 August 2025).

React Navigation (2025) Navigating. Available at: https://reactnavigation.org/docs/navigating (Accessed: 10 August 2025).

React Native (2025) Components and APIs. Available at: https://reactnative.dev/docs/components-and-apis (Accessed: 12 August 2025).

React Native (2025) Getting Started - Prerequisites. Available at: https://reactnative.dev/docs/getting-started#prerequisites (Accessed: 12 August 2025).

React Native (2025) Using a ListView. Available at: https://reactnative.dev/docs/using-a-listview (Accessed: 10 August 2025).

Shopify Polaris (2025) Getting Started. Available at: https://polaris-react.shopify.com/getting-started (Accessed: 10 August 2025).

Shopify Polaris (2025) Layout Design. Available at: https://polaris-react.shopify.com/design/layout (Accessed: 12 August 2025).

[Unknown Author] (no date) Video title unknown. Available at: https://youtu.be/JJR60QtgdsM?si=VXMbtFdNwMzn4xlF (Accessed: 8 August 2025).

[Unknown Author] (no date) Video title unknown. Available at: https://youtu.be/LKrX390fJMw?si=69gLkYov4KRgwtoZ (Accessed: 1 August 2025).

[Unknown Author] (no date) Video title unknown. Available at: https://youtu.be/fLIl6jypzkI?si=aYYjamEqKgIkAG2m (Accessed: 2 August 2025).

[Unknown Author] (no date) Video title unknown. Available at: https://youtu.be/kxrkQLTSdsc?si=7E4do4ym0sDyM531 (Accessed: 2 August 2025).

[Unknown Author] (no date) Video title unknown. Available at: https://youtu.be/vk13GJi4Vd0?si=sBr6sF4NbIJQ84TC (Accessed: 4 August 2025).

[Unknown Author] (no date) Video title unknown. Available at: https://youtu.be/wbj-DuaL748?si=49R3Hfbjw6oTaho6 (Accessed: 8 August 2025).

Unsplash (no date) Assorted vegetables (KUZnfk-2DSQ). Available at: https://unsplash.com/photos/assorted-vegetables-KUZnfk-2DSQ (Accessed: 1 October 2025).

Unsplash (no date) Assorted vegetables (wtevVfGYwnM). Available at: https://unsplash.com/photos/assorted-vegetables-wtevVfGYwnM (Accessed: 1 October 2025).

Unsplash (no date) Bowl of cooked food. Available at: https://unsplash.com/photos/bowl-of-cooked-food-mVZ_gjm_TOk (Accessed: 5 November 2025).

Unsplash (no date) Bread with vegetable on blue plate. Available at: https://unsplash.com/photos/bread-with-vegetable-on-blue-plate-Q9-fkDRRvAk (Accessed: 5 November 2025).

Unsplash (no date) Cooked dish. Available at: https://unsplash.com/photos/cooked-dish-mjcJ0FFgdWI (Accessed: 5 November 2025).

Unsplash (no date) Empty cups on tray. Available at: https://unsplash.com/photos/empty-cups-on-tray-GrPm7g3crwQ (Accessed: 1 October 2025).

Unsplash (no date) Five gray spoons filled with assorted color powders near chilli. Available at: https://unsplash.com/photos/five-gray-spoons-filled-with-assorted-color-powders-near-chilli-vA1L1jRTM70 (Accessed: 1 October 2025).

Unsplash (no date) Homepage. Available at: https://unsplash.com/ (Accessed: 1 October 2025).

Unsplash (no date) People inside eatery. Available at: https://unsplash.com/photos/people-inside-eatery-WWST6E8LxeE (Accessed: 1 October 2025).

Unsplash (no date) Several bottles of wine are lined up on a shelf. Available at: https://unsplash.com/photos/several-bottles-of-wine-are-lined-up-on-a-shelf-PwPUaUpUHOs (Accessed: 1 October 2025).

Unsplash (no date) Sliced cake with cherry on white ceramic plate. Available at: https://unsplash.com/photos/sliced-cake-with-cherry-on-white-ceramic-plate-XtYPjMTNQUA (Accessed: 3 November 2025).

Unsplash (no date) Strawberry juice in clear drinking glass. Available at: https://unsplash.com/photos/strawberry-juice-in-clear-drinking-glass-ycnvnL4beLo (Accessed: 3 November 2025).

Unsplash (no date) Table topped with plates and bowls of food. Available at: https://unsplash.com/photos/a-table-topped-with-plates-and-bowls-of-food-i_aER9p0Iw0 (Accessed: 4 November 2025).

Unsplash (no date) Vegetable salad on white ceramic plate. Available at: https://unsplash.com/photos/vegetable-salad-on-white-ceramic-plate-xeTv9N2FjXA (Accessed: 4 November 2025).

Unsplash (no date) White ceramic plates. Available at: https://unsplash.com/photos/white-ceramic-plates-0hAdietsUrE (Accessed: 1 October 2025).

Unsplash (no date) A group of fruit tarts sitting on top of a table. Available at: https://unsplash.com/photos/a-group-of-fruit-tarts-sitting-on-top-of-a-table-K8z5FJUay74 (Accessed: 6 November 2025).
