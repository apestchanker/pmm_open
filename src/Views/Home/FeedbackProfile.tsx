import ResponsiveAppBar from 'Components/AppBar';
import { Routes, Route } from 'react-router-dom';
import Marketplace from 'Views/Marketplace';
import Help from 'Components/Help/Help';

export default function FeedbackProfile() {
  return (
    <>
      <ResponsiveAppBar />
      <Routes>
        <Route path="/Marketplace" element={<Marketplace />} />
        <Route path="/Help" element={<Help />} />
      </Routes>
    </>
  );
}
