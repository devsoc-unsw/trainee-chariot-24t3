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
    <div className="bg-[#FFF8D3] min-h-screen shadow-inner pl-10 pr-10 ">
      <div className="flex justify-start text-3xl text-[#6F6F6F] pt-5 pb-5">  
        Events
      </div>
      <div className="flex justify-between">
        <div className="flex"> 
          <div className="flex">
            <NavigationList onActiveButtonChange={handleActiveButtonChange}/>
          </div>
        </div>
        <div className='container basis-auto font-large flex h-full justify-center'>
          <div className='text-3xl text-center'>
            <div> 
              {getContent()}
            </div>
          </div>
        </div>
        <div className='container basis-auto font-large flex h-full justify-center'>
          <div className='text-3xl text-center'>
            <div> 
              Event stuff
            </div>
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
    <div className="bg-[#D9D9D9] p-4 rounded-[20px] h-[46rem] w-64 flex flex-col content-between gap-[475px]">
        <div className=''>  
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

export default EventList;
