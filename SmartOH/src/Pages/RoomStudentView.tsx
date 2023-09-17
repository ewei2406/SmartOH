import Logout from "../Components/Logout";

const RoomStudentView = ({ currentData, setCurrentData }: any) => {
  return (
    <div style={{ width: "300px", height: "300px" }}>
      <iframe
        title="test"
        style={{ border: 'none', height: '700px', width: '420%' }}
        src="https://virginia.zoom.us/j/91538770185"
        sandbox="allow-forms allow-scripts allow-same-origin"
        allow="microphone; camera"
      />
      <Logout currentData={currentData} setCurrentData={setCurrentData} />
    </div>
  );
};

export default RoomStudentView;
