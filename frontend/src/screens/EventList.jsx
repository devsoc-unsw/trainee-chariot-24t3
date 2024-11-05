import React, { useState } from 'react';
import arcLogo from "../assets/arcLogo.jpg";
import climateExpo from "../assets/climateExpo.jpg";


const pictures = {
  arcLogo: arcLogo,
  climateExpo: climateExpo, 
};

const characterLimit = 100; 

function EventList() {
  const [activeButton, setActiveButton] = useState(1);

  const handleActiveButtonChange = (buttonIndex) => {
    setActiveButton(buttonIndex);
  };


  // const getContent = () => {
  //   switch (activeButton) {
  //     case 1:
  //       return <EventDetails/>;
  //     case 2:
  //       return "--------- No Ongoing Events :( ---------";
  //     case 3:
  //       return "--------- No New Events :( ---------";
  //   }
  // }

  return (
    <div className="bg-[#FFF8D3] min-h-screen shadow-inner pl-10 pr-10 ">
      <div className="flex justify-start text-3xl text-[#6F6F6F] pt-5 pb-5">  
        Events
      </div>
      <div className="flex justify-between gap-10">
        <div className="flex"> 
          <div className="flex">
            <NavigationList onActiveButtonChange={handleActiveButtonChange}/>
          </div>
        </div>
        <div className='flex-grow'>
          <div className='text-3xl'>
            <div className='flex flex-col gap-6'> 
              {/* {getContent()} */}
              <EventDetails 
                picture = "arcLogo" 
                title = "DevSoc Pizza Party" 
                location = "Laws 103, 8am - 2pm Fri, May 9, 2025 - May 11, 2025"
                body = {truncateText("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e...")}
              />
              <EventDetails 
                picture = "climateExpo" 
                title = "Futures Expo Series" 
                location = "Roundhouse UNSW, 3:30pm - 6:30pm 29 May"
                body = {truncateText("UNSW is hosting a series of events in 2024 that showcase translational research aligned with the National Reconstruction Fund's (NRF) priority areas. The NRF was announced in late 2022 as a $15 billion investment to fund projects that diversify and transform Australia’s economy in targeted areas. The Futures Expo Series is a platform for businesses, investors and government to network and explore collaboration opportunities with UNSW's leading innovation community.")}
              />
              <EventDetails 
                picture = "climateExpo" 
                title = "Futures Expo Series" 
                location = "Roundhouse UNSW, 3:30pm - 6:30pm 29 May"
                body = {truncateText("UNSW is hosting a series of events in 2024 that showcase translational research aligned with the National Reconstruction Fund's (NRF) priority areas. The NRF was announced in late 2022 as a $15 billion investment to fund projects that diversify and transform Australia’s economy in targeted areas. The Futures Expo Series is a platform for businesses, investors and government to network and explore collaboration opportunities with UNSW's leading innovation community.")}
              />
              <EventDetails 
                picture = "climateExpo" 
                title = "Futures Expo Series" 
                location = "Roundhouse UNSW, 3:30pm - 6:30pm 29 May"
                body = {truncateText("UNSW is hosting a series of events in 2024 that showcase translational research aligned with the National Reconstruction Fund's (NRF) priority areas. The NRF was announced in late 2022 as a $15 billion investment to fund projects that diversify and transform Australia’s economy in targeted areas. The Futures Expo Series is a platform for businesses, investors and government to network and explore collaboration opportunities with UNSW's leading innovation community.")}
              />
              <EventDetails 
                picture = "climateExpo" 
                title = "Futures Expo Series" 
                location = "Roundhouse UNSW, 3:30pm - 6:30pm 29 May"
                body = {truncateText("UNSW is hosting a series of events in 2024 that showcase translational research aligned with the National Reconstruction Fund's (NRF) priority areas. The NRF was announced in late 2022 as a $15 billion investment to fund projects that diversify and transform Australia’s economy in targeted areas. The Futures Expo Series is a platform for businesses, investors and government to network and explore collaboration opportunities with UNSW's leading innovation community.")}
              />
              <EventDetails 
                picture = "climateExpo" 
                title = "Futures Expo Series" 
                location = "Roundhouse UNSW, 3:30pm - 6:30pm 29 May"
                body = {truncateText("UNSW is hosting a series of events in 2024 that showcase translational research aligned with the National Reconstruction Fund's (NRF) priority areas. The NRF was announced in late 2022 as a $15 billion investment to fund projects that diversify and transform Australia’s economy in targeted areas. The Futures Expo Series is a platform for businesses, investors and government to network and explore collaboration opportunities with UNSW's leading innovation community.")}
              />
              <EventDetails 
                picture = "climateExpo" 
                title = "Futures Expo Series" 
                location = "Roundhouse UNSW, 3:30pm - 6:30pm 29 May"
                body = {truncateText("UNSW is hosting a series of events in 2024 that showcase translational research aligned with the National Reconstruction Fund's (NRF) priority areas. The NRF was announced in late 2022 as a $15 billion investment to fund projects that diversify and transform Australia’s economy in targeted areas. The Futures Expo Series is a platform for businesses, investors and government to network and explore collaboration opportunities with UNSW's leading innovation community.")}
              />
              <EventDetails 
                picture = "climateExpo" 
                title = "Futures Expo Series" 
                location = "Roundhouse UNSW, 3:30pm - 6:30pm 29 May"
                body = {truncateText("UNSW is hosting a series of events in 2024 that showcase translational research aligned with the National Reconstruction Fund's (NRF) priority areas. The NRF was announced in late 2022 as a $15 billion investment to fund projects that diversify and transform Australia’s economy in targeted areas. The Futures Expo Series is a platform for businesses, investors and government to network and explore collaboration opportunities with UNSW's leading innovation community.")}
              />
            </div>
          </div>
        </div>
        <div className=' justify-center'>
          <div className='flex flex-col gap-4'>
            <SavedEvents/>
            <RecentlyViewed />
          </div>
        </div>
      </div>
    </div>
  );
}

function NavigationList({ onActiveButtonChange }) {
  const [activeButton, setActiveButton] = useState(1);

  const handleButtonClick = (buttonIndex) => {
    setActiveButton(buttonIndex);
    onActiveButtonChange(buttonIndex); 
  };


  return (
    <div className="bg-[#D9D9D9] p-4 rounded-[20px] h-[46rem] w-64 flex flex-col content-between gap-[465px]">
        <div className='flex flex-col gap-1'>  
          <div className='w-full'> 
            <Button
            label="Upcoming"
            variant={activeButton === 1 ? 'primary' : 'default'}
            onClick={() => handleButtonClick(1)}
            />
          </div>
          <div className='w-full'> 
            <Button
            label="Ongoing"
            variant={activeButton === 2 ? 'primary' : 'default'}
            onClick={() => handleButtonClick(2)}
            />
          </div>
          <div className='w-full'> 
            <Button
            label="Newest"
            variant={activeButton === 3 ? 'primary' : 'default'}
            onClick={() => handleButtonClick(3)}
            />
          </div> 
        </div>
        <div className=''> 
          <Button
          label="+ Add Event"
          variant={'eventAdd'}
          />
        </div>
    </div>
  );
}

const Button = ({ label, type = 'button', variant = 'primary', onClick }) => {
  
  const variants = {
    primary: 'bg-white font-bold font-large text-3xl',
    default: 'bg-[#D9D9D9] text-black hover:bg-gray-400 font-medium text-3xl',
    eventAdd: 'bg-orange-400 hover:bg-orange-500 text-3xl	', 
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-[14px] focus:outline-none ${variants[variant]} w-full mb-2`}
    >
      {label}
    </button>
  );
};

function EventDetails({picture, title, location, body}) {
  const getPicture = (picture) => {
    return pictures[picture] || arcLogo; 
  };

  return (
    <div className="bg-[#EFD780] p-4 rounded-[30px] flex gap-8">
      <div className='w-80 h-60 flex-shrink-0'> 
        <img
          src= {getPicture(picture)}
          alt="Event picture"
          className="w-full h-full object-cover  rounded-[30px]"
        />
      </div>
      
      <div className="flex flex-col text-left">
        <div>
          <h1 className='flex font-bold text-4xl '>
            {title}
          </h1> 
        </div>
        <div className='flex text-2xl flex-col'>
          <div>
            {location}
          </div>
          <br />
          <div> 
            {body}
          </div>
        </div>
      </div>
    </div>
  );
}


function SavedEvents() {
  return (
    <div className="bg-[#D9D9D9] p-5 rounded-[30px] flex gap-4 min-h-64 min-w-[440px] flex flex-col text-start">
      <div className='text-3xl'>
        Saved Events
      </div>
      <div className='flex flex-col gap-4'>
        <EventItem title="Reeeeee" body="Fri, May 15, 2025 - May 16, 2025 In 6 days"/> 
        <EventItem title="Held by hopes and dreams" body="Fri, May 15, 2025 - May 16, 2025 In 6 days"/> 
        <EventItem title=":(" body="Fri, May 15, 2025 - May 16, 2025 In 6 days"/> 
      </div>
    </div>
  );
}

function RecentlyViewed() {
  return (
    <div className="bg-[#D9D9D9] p-5 rounded-[30px] flex gap-4 min-h-64 min-w-[440px] flex flex-col text-start">
      <div className='text-3xl text-start'>
        Recently Viewed 
      </div>
      <div className='flex flex-col gap-4'> 
        <EventItem title="Can someone" body="Fri, May 15, 2025 - May 16, 2025 In 6 days"/> 
        <EventItem title="Think of a better color" body="Fri, May 15, 2025 - May 16, 2025 In 6 days"/> 
        <EventItem title="Instead of gray" body="Fri, May 15, 2025 - May 16, 2025 In 6 days"/> 
        <EventItem title="DevSoc Pizza Party" body="Fri, May 15, 2025 - May 16, 2025 In 6 days"/> 
      </div>
    </div>
  );
}


function EventItem({title, body}) {
  return (
    <div className='bg-[#EFD780] min-h-16 rounded-[10px] min-w-[400px]	flex flex-col p-2'>
      <div className='font-medium	text-2xl	'>
        {title}
      </div>
      <div>
        {body}
      </div>
    </div>
  );
}

function truncateText(text) {
  if (text.length > characterLimit) {
    return text.slice(0, characterLimit) + "...";
  }
  return text;
}
export default EventList;
