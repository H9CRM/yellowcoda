import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartDrawer from './components/ui/CartDrawer';
import CompareTray from './components/ui/CompareTray';
import CompareModal from './components/ui/CompareModal';
import AppRoutes from './routes/AppRoutes';
import ScrollManager from './components/common/ScrollManager';
import { StoreProvider } from './hooks/useStore';
export default function App() { return <StoreProvider><ScrollManager/><a href="#main" className="skip-link absolute -top-24 left-3 z-[100] bg-gold-pale p-3 focus:top-2.5">Skip to main content</a><Header/><main id="main"><AppRoutes/></main><Footer/><CartDrawer/><CompareTray/><CompareModal/></StoreProvider>; }
