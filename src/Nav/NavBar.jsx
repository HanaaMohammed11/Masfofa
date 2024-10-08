import { Navbar, Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <Navbar fluid={true} rounded={true} className="b shadow-lg">
     
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Button onClick={() => navigate('/Matrix')} color="gray" className="text-gray-800">
          المصفوفات
        </Button>
        <Button onClick={() => navigate('/sujects')} color="gray" className="text-gray-800">
          المواد
        </Button>
        <Button onClick={() => navigate('/users')} color="gray" className="text-gray-800">
          الموظفين
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
}
