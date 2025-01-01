import { useState } from 'react';
import Navbar from '@/components/Navbar';
import BreadcrumbBar from '@/components/BreadcrumbBar';
import { Route, Routes, useLocation } from 'react-router-dom';
import TwoPhasePage from '@/pages/TwoPhase';
import BigMPage from '@/pages/BigM';
import NoSuchPage from './pages/NoSuchPage';
import { Stack } from "@chakra-ui/react";
import { getPageName } from './util/pageName';

export const BASE_URL = import.meta.env.VITE_BASE_URL;

function App() {
  const [navbarHeight, setNavbarHeight] = useState<number>(0);
  const location = useLocation();
  const currentPageUrl = location.pathname;
  const currentPageName = getPageName(currentPageUrl);

  return (
    <>
      <Navbar setNavbarHeight={setNavbarHeight} />
      <Stack paddingBottom={40} pt={`${navbarHeight + 20}px`} maxWidth={"120vh"} px={4} gap={2} mx="auto">
        <BreadcrumbBar linkList={[
          { name: currentPageName, url: currentPageUrl },
        ]} />
        <Routes>
            <Route path="/two-phase" element={<TwoPhasePage />} />
            <Route path="/big-m" element={<BigMPage />} />
            <Route path="*" element={<NoSuchPage />} />
        </Routes>
      </Stack>
    </>
  );
}

export default App;