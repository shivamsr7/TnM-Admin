import {
  NavLink,
} from "react-router-dom";

import {
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";


import { menuItems } from "@/config/menu";

import AppLogo from "@/components/shared/AppLogo";



interface SidebarProps {
  open: boolean;
  onClose: () => void;
}



export default function Sidebar({
  open,
  onClose,
}: SidebarProps) {


  const [expanded, setExpanded] =
    useState<string[]>([]);


  const startX =
    useRef<number | null>(null);



  const sidebarRef =
    useRef<HTMLDivElement>(null);



  useEffect(() => {

    if (open) {

      document.body.style.overflow =
        "hidden";

    } else {

      document.body.style.overflow =
        "";

    }


    return () => {

      document.body.style.overflow =
        "";

    };

  }, [open]);




  const handleTouchStart = (
    e: React.TouchEvent
  ) => {

    startX.current =
      e.touches[0].clientX;

  };



  const handleTouchMove = (
    e: React.TouchEvent
  ) => {

    if (
      startX.current === null
    ) return;


    const currentX =
      e.touches[0].clientX;


    const diff =
      startX.current - currentX;



    // swipe left

    if (diff > 80) {

      onClose();

      startX.current = null;

    }

  };




  const navLinks = (

    <nav className="space-y-2 p-4">

      {menuItems.map((item) => {


        const Icon = item.icon;


        const hasChildren =
          !!item.children?.length;



        const isExpanded =
          expanded.includes(
            item.title
          );



        if (hasChildren) {

          return (

            <div key={item.title}>


              <button

                type="button"

                onClick={() =>
                  setExpanded((prev) =>
                    isExpanded
                      ? prev.filter(
                          (x) =>
                            x !== item.title
                        )
                      : [
                          ...prev,
                          item.title,
                        ]
                  )
                }

                className="flex w-full items-center justify-between rounded-lg px-4 py-3 hover:bg-gray-100"

              >

                <div className="flex items-center gap-3">

                  <Icon size={20} />

                  <span>
                    {item.title}
                  </span>

                </div>



                {
                  isExpanded ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )
                }


              </button>




              {
                isExpanded && (

                  <div className="ml-8 mt-2 space-y-1">

                    {
                      item.children?.map(
                        (child) =>

                          child.path && (

                            <NavLink

                              key={child.path}

                              to={child.path}

                              onClick={onClose}

                              className={({isActive}) =>
                                `block rounded-md px-3 py-2 text-sm ${
                                  isActive
                                    ? "bg-black text-white"
                                    : "hover:bg-gray-100"
                                }`
                              }

                            >

                              {child.title}

                            </NavLink>

                          )

                      )
                    }

                  </div>

                )
              }


            </div>

          );

        }




        if (!item.path) {
          return null;
        }



        return (

          <NavLink

            key={item.title}

            to={item.path}

            end={
              item.path === "/"
            }

            onClick={onClose}

            className={({isActive}) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }

          >

            <Icon size={20}/>

            <span>
              {item.title}
            </span>


          </NavLink>

        );


      })}

    </nav>

  );




  return (

    <>

      {/* Desktop */}

      <aside className="hidden lg:flex lg:w-64 lg:min-h-screen lg:flex-col lg:border-r lg:bg-white">


        <div className="border-b p-6">

          <AppLogo />

        </div>


        {navLinks}


      </aside>





      {/* Mobile */}
{/* Mobile */}

<aside

  ref={sidebarRef}

  onTouchStart={handleTouchStart}

  onTouchMove={handleTouchMove}

  className={`fixed inset-0 z-50 flex h-dvh w-64 flex-col border-r bg-white shadow-xl transition-transform duration-300 lg:hidden ${
    open
      ? "translate-x-0"
      : "-translate-x-full"
  }`}

>


  {/* Header */}

  <div className="flex shrink-0 items-center justify-between border-b p-6">

    <AppLogo />


    <button

      onClick={onClose}

      className="rounded-md p-2 text-gray-900 hover:bg-gray-100"

    >

      <X size={20} />

    </button>


  </div>



  {/* Scroll Area */}

  <div

    className="
      mobile-sidebar-scroll
      min-h-0
      flex-1
      overflow-y-auto
      overscroll-contain
    "

    style={{

      WebkitOverflowScrolling: "touch",

      paddingBottom:
        "env(safe-area-inset-bottom)",

    }}

  >

    {navLinks}

  </div>


</aside>



      {/* Overlay */}

      {
        open && (

          <div

            onClick={onClose}

            className="fixed inset-0 z-40 bg-black/40 lg:hidden"

          />

        )
      }


    </>

  );

}