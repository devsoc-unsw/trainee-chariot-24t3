import React, { useState } from 'react';

function EventList() {
  const [activeButton, setActiveButton] = useState(1);

  const handleActiveButtonChange = (buttonIndex) => {
    setActiveButton(buttonIndex);
  };


  const getContent = () => {
    switch (activeButton) {
      case 1:
        return "--------- No Upcoming Events :( ---------";
      case 2:
        return "--------- No Ongoing Events :( ---------";
      case 3:
        return "--------- No New Events :( ---------";
    }
  }

  return (
    <div className="bg-[#FFF8D3] min-h-screen flex justify-start">
      <div className="pl-10 pt-5"> 
        <div className="justify pr-30 text-black">  
          <h1> 
            Events
          </h1>
        </div>
        <div className="pt-4">
          <NavigationList onActiveButtonChange={handleActiveButtonChange}/>
        </div>
      </div>
      <div className='w-full font-large flex justify-center items-center pt-16 h-full'>
        <div className='text-3xl'>
          <div> 
            {getContent()}
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
    <div className="bg-[#D9D9D9] p-2 rounded-lg h-80 w-32">
      <div className="flex-col justify-evenly"> 
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
        </div > 
        <div className='mt-24'> 
          <Button
          label="+ Add Event"
          variant={'eventAdd'}
          />
        </div>
      </div>
    </div>
  );
}

function Upcoming() {
  return (
    <div className="align-middle"> 
      Upcoming
    </div>
  )
}

function Ongoing() {
  return (
    <div className=""> 
      Ongoing
    </div>
  )
}

function New() {
  return (
    <div className=""> 
      New
    </div>
  )
}

function newEvent() {
  return (
    <div className="black"> 
      Event stuff
    </div>
  )
}

const Button = ({ label, type = 'button', variant = 'primary', onClick }) => {
  
  const variants = {
    primary: 'bg-white font-bold font-large',
    default: 'bg-[#D9D9D9] text-black hover:bg-gray-400 font-medium',
    eventAdd: 'bg-orange-400 hover:bg-orange-500', 
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded focus:outline-none ${variants[variant]} w-full mb-2`}
    >
      {label}
    </button>
  );
};

export default EventList;
