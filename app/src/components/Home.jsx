import React, {
  useState,
  useContext,
  useRef,
} from 'react';
import { SermonContext } from '../components/GlobalState';
import { motion } from 'framer-motion';
import { Drawer, Button, Input } from 'antd';
import {
  HomeOutlined,
  BookOutlined,
  VideoCameraOutlined,
  SettingOutlined,
  SortAscendingOutlined,
  EyeInvisibleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Home1 from './Home1'
import HomeContent from './HomeContent';
import SermonsContent from './SermonsContent';
import VideosContent from './VideosContent';
import SettingsContent from './SettingsContent';
import SongsContent from './SongContent';
import TitleDrop from './TitleDrop';
import YearDrop from './YearDrop';
import SermonList from './SermonList';
import TourComponent from '../components/Tour.js';
import FloatingSearchIcon from './Search';

const { Search } = Input;

const Home = () => {
  const [runTour, setRunTour] = useState(false);
  const {
    selectedSermon,
    sermonsInTab,
    setSelectedSermon,
    deleteSermonInTab,
    allSermons,
    setAllSermons,
    settings
  } = useContext(SermonContext);
  const [activeTab, setActiveTab] = useState('Home');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [ascending, setAscending] = useState(true);
  const sermonTextRef = useRef(null);

  const startTour = () => {
    setRunTour(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeContent />;
      case 'Home1':
        return <Home1 sermonTextRef={sermonTextRef}/>;
      case 'Sermons':
        return <SermonsContent sermonTextRef={sermonTextRef} />;
      case 'Videos':
        return <VideosContent />;
      case 'Settings':
        return <SettingsContent />;
      case 'Songs':
        return <SongsContent />;
      default:
        return <HomeContent />;
    }
  };

  const sortByTitle = () => {
    const sortedSermons = [...allSermons].sort((a, b) => {
      const titleA = a.title.toUpperCase();
      const titleB = b.title.toUpperCase();
      return ascending ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
    });
    setAllSermons(sortedSermons);
    setAscending(!ascending);
  };

  const handleSermonClick = (sermon) => {
    setSelectedSermon(sermon);
  };

  const searchText = (searchTerm) => {
    const input = searchTerm
      .trim()
      .toLowerCase()
      .replace(/[^\w\s]/g, '');
    const paragraph = sermonTextRef.current;
    const text = paragraph.innerText.toLowerCase().replace(/[^\w\s]/g, '');

    // Remove previous highlights
    paragraph.innerHTML = paragraph.innerText;

    if (input.length > 0) {
      const inputRegex = input.split(/\s+/).join('\\s*');
      const regex = new RegExp(inputRegex, 'gi');
      const matches = text.match(regex);

      if (matches) {
        let highlightedText = paragraph.innerHTML;

        matches.forEach((match) => {
          // Create a regex for the original match in the paragraph with punctuation and spaces
          const originalMatchRegex = new RegExp(
            match.split('').join('[^\\w\\s]*'),
            'i'
          );
          const originalMatchArray =
            paragraph.innerText.match(originalMatchRegex);

          if (originalMatchArray) {
            const originalMatch = originalMatchArray[0];
            highlightedText = highlightedText.replace(
              new RegExp(
                originalMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                'gi'
              ),
              `<span class="highlight">$&</span>`
            );
          }
        });

        paragraph.innerHTML = highlightedText;

        // Scroll to the first highlighted text
        const highlightElement = paragraph.querySelector('.highlight');
        if (highlightElement) {
          highlightElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      } else {
        // Reset scroll position if no match is found
        window.scrollTo(0, 0);
      }
    }
  };

  const toggleSidebarVisibility = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex bg-background flex-col min-h-screen overflow-x-hidden home"
    >
      <header className="bg-background text-text fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center space-x-4 justify-between">
          <div className="flex items-center justify-center gap-8 pr-10">
            <Button
              className='bg-[transparent] border-none'
              icon={<HomeOutlined className='text-text hover:text-[black]'/>}
              onClick={() => setActiveTab('Home')}
              title="home"
            />
            <Button
              className='bg-[transparent] border-none'
              icon={<BookOutlined className='text-text hover:text-[black]'/>}
              onClick={() => {
                setActiveTab('Sermons');
                toggleSidebarVisibility();
              }}
            />
            <Button
              className='bg-[transparent] border-none'
              icon={<VideoCameraOutlined className='text-text hover:text-[black]'/>}
              onClick={() => setActiveTab('Videos')}
              title="media"
            />
            <Button
              className='bg-[transparent] border-none'
              icon={<SettingOutlined spin className='text-text hover:text-[black]'/>}
              onClick={() => setActiveTab('Settings')}
              title="settings"
            />
            <video
              autoPlay
              loop
              className="h-14 w-14 rounded-lg transition duration-300 ease-in-out transform
              hover:scale-[9] hover:shadow-lg
              hover:translate-y-[25vh] hover:translate-x-[30%]
              focus:scale-[1.2] focus:shadow-lg
              focus:-translate-y-[18vh] focus:translate-x-[20%]"
            >
              <source src="./vid.webm" type="video/webm" className="rounded-lg" />
            </video>
            {activeTab === 'Sermons' && (
              <Button type='primary' onClick={startTour}>
                Start Tour
              </Button>
            )}
        {
          activeTab === 'Sermons' && <FloatingSearchIcon searchText={searchText}/>
        }
            <TourComponent runTour={runTour} setRunTour={setRunTour} />
          </div>
        </div>
        {activeTab === 'Sermons' && (
          <div className="bg-lighter p-2 gap-3 flex items-center justify-between">
            <div className="">
              <p className="font-mono text-text">{selectedSermon?.title}</p>
              <p className="text-textBlue font-mono"> {selectedSermon?.date}</p>
            </div>
            {sermonsInTab.length > 0 && (
              <div className="flex items-center justify-center gap-2">
                {sermonsInTab.map((sermon) => (
                  <div
                    className="flex items-center justify-center p-2 rounded-lg bg-background gap-2 hover:cursor-pointer group"
                    key={sermon.id}
                  >
                    <p
                      className="text-[.7rem]"
                      onClick={() => handleSermonClick(sermon)}
                    >
                      {sermon.title.slice(0, 10)}
                    </p>
                    <Button
                      type="text"
                      icon={<EyeInvisibleOutlined />}
                      className="text-textBlue text-[.5rem] cursor-pointer size-3 opacity-0 group-hover:opacity-100 group-hover:block transition-opacity duration-300 ease-in-out transform group-hover:scale-110 inline-block"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteSermonInTab(sermon);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </header>
      <div className="flex pt-16  ">
        <Drawer
          title="Sermons"
          placement="left"
          closable={false}
          onClose={toggleSidebarVisibility}
          open={isSidebarVisible && activeTab === 'Sermons'}
          width={400}
          bodyStyle={{ paddingBottom: 80,backgroundColor:'#171a1c' }}
          className='w-full'
        >
          <div className="mb-4 flex flex-col gap-2">
            <Button
              icon={<SortAscendingOutlined />}
              onClick={sortByTitle}
              className="w-full"
            >
              Sort by Title
            </Button>
            <TitleDrop title="Sort by Title" id="title" />
            <YearDrop title="Sort by Year" id="year" />
            <Search
              placeholder="Search sermons"
              onSearch={searchText}
              enterButton={<SearchOutlined />}
            />
          </div>
          <SermonList setIsSidebarVisible={setIsSidebarVisible} />
        </Drawer>
        <main
          className="w-[100vw] flex flex-col"
          style={{
            backgroundImage: 'url(./darker.jpg)',
            backgroundSize: 'cover',
            width: '100vw',
            backgroundPosition: 'center',
          }}
        >
          <div className=""  style={{
            // backgroundImage: settings.useImageBackground && 'url(/darker.jpg)',
            backgroundSize: 'cover',
            width: '100vw',
            backgroundPosition: 'center',
          }}>{renderContent()}</div>
        </main>
      </div>
    </motion.div>
  );
};

export default Home;