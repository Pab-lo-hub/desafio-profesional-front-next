// Header.js
import React from 'react';

const Header = () => {
    return (
        <header>
            <nav>
                <header className="bg-white">
                    <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                        <div className="flex lg:flex-1">
                            <a href="#" className="-m-1.5 p-1.5">
                                <span className="sr-only">Rent</span>
                                <img className="h-32 w-auto" src="./travel-nest-logo.png" alt="" />
                            </a>
                        </div>
                        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                            <a href="#" className="text-sm/6 font-semibold text-gray-900">Log in <span aria-hidden="true">&rarr;</span></a>
                        </div>
                    </nav>
                    {/* <!-- Mobile menu, show/hide based on menu open state. --> */}
                    <div className="lg:hidden" role="dialog" aria-modal="true">
                        {/* <!-- Background backdrop, show/hide based on slide-over state. --> */}
                        <div className="fixed inset-0 z-10"></div>
                        <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                            <div className="flex items-center justify-between">
                                <a href="#" className="-m-1.5 p-1.5">
                                    <span className="sr-only">Travel-Nest</span>
                                    <img className="h-8 w-auto" src="./travel-nest-logo.png" alt="" />
                                </a>
                                <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700">
                                    <span className="sr-only">Close menu</span>
                                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="mt-6 flow-root">
                                <div className="-my-6 divide-y divide-gray-500/10">
                                    <div className="space-y-2 py-6">
                                        <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Features</a>
                                        <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Marketplace</a>
                                        <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Company</a>
                                    </div>
                                    <div className="py-6">
                                        <a href="#" className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Log in</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

            </nav>
            <h1>Travel Nest</h1>
        </header>
    );
};

export default Header;