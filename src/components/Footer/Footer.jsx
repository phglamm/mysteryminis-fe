import { motion } from 'framer-motion';
import Logo from '../../assets/images/Logo-removebg.png';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  const initial = { 
    color: 'gray'
  };

  const hoverEffect = {
    scale: 1.1,
    color: 'white'
  };

  const tapEffect = {
    scale: 0.9
  };

  const footerSections = [
    {
      title: 'MYSTERY MINIS',
      items: [
        { name: '', link: '' }
      ],
      span: 2,
      isLogo: true
    },
    {
      title: 'POLICY',
      items: [
        { name: 'Privacy Policy', link: '/privacy-policy' },
        { name: 'Shipping Policy', link: '/shipping-policy' },
        { name: 'Return Policy', link: '/return-policy' },
        { name: 'Terms of Use', link: '/terms-of-use' }
      ]
    },
    {
      title: 'INSTRUCT',
      items: [
        { name: 'Buying Guide', link: '/buying-guide' },
        { name: 'Payment Instructions', link: '/payment-instructions' },
        { name: 'Delivery Instructions', link: '/delivery-instructions' },
        { name: 'Terms of Service', link: '/terms-of-service' }
      ]
    },
    {
      title: 'CATEGORIES',
      items: [
        { name: 'New Arrivals', link: '/new-arrivals' },
        { name: 'BestSellers', link: '/best-sellers' },
        { name: 'Return Policy', link: '/return-policy' },
        { name: 'Sale Off', link: '/sale-off' }
        
      ]
    },
    {
      title: 'CONTACT',
      items: [
        { name: 'Email: swdblindbox@fpt.vn' },
        { name: 'Hotline : +849088989889' },
        { name: 'All days of the week' },
        { name: '83 Le Loi, District 1, HCMC, VietNam' }
      ],
      span: 2
    }
    
  ];

  return(
    <div className="bg-black w-screen bottom-0 text-white">
      <div className="grid grid-cols-7 text-center p-6">
        {footerSections.map((section, index) => (
          <div 
            key={index} 
            className={`flex flex-col justify-center items-center text-center ${section.span ? `col-span-${section.span}` : ''}`}
          >
            {section.isLogo ? (
              <>
                <img src={Logo} alt="Logo" className="w-[20vw] max-w-[280px] h-fit mb-2" />
                <div className="text-[2.5vw] font-bold">Mystery Minis</div>
              </>
            ) : (
              <>
                <div className="font-bold flex justify-center text-[1.6vw] mb-4 whitespace-nowrap ">{section.title}</div>
                {section.items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={initial}
                    whileHover={hoverEffect}
                    whileTap={tapEffect}
                    onClick={() => navigate(item.link)}
                    className='lg:text-[1vw] md:[1.2vw] sm:text-[1.3vw] text-[1.3vw] '
                    style={{ userSelect: 'none' }}
                  >
                    {item.name}
                  </motion.div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
      <div className='text-center h-fit g:tlext-[1vw] md:[1.2vw] sm:text-[1.3vw] text-[1.3vw] border-t border-red-800 '>
        © 2025 Luxury Orchids Official Store. All Rights Reserved.
      </div>
    </div>
  );
}
