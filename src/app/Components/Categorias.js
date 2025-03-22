import React from 'react'

const categoriasList = [
    {
        id: 1,
        name: 'Categorias',
        href: '#',
        price: '$48',
        imageSrc: 'https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg',
        imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
    },
    {
        id: 2,
        name: 'Categorias',
        href: '#',
        price: '$35',
        imageSrc: 'https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-02.jpg',
        imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
    },
    {
        id: 3,
        name: 'Categorias',
        href: '#',
        price: '$89',
        imageSrc: 'https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-03.jpg',
        imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
    },
    {
        id: 4,
        name: 'Categorias',
        href: '#',
        price: '$89',
        imageSrc: 'https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-03.jpg',
        imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
    },
]

const Categorias = () => {
    return (
        <div className="pt-1">
            <div className="mx-auto max-w-2xl px-1 py-1 sm:px-6 sm:py-1 lg:max-w-7xl lg:px-8">
                <h1 className='text-3xl font-bold underline text-[#7d858c]'>Categorias</h1>
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {categoriasList.map((categoria) => (
                        <a key={categoria.id} href={categoria.href} className="group">
                            <img
                                alt={categoria.imageAlt}
                                src={categoria.imageSrc}
                                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                            />
                            <h3 className="mt-4 text-sm text-gray-700">{categoria.name}</h3>
                            <p className="mt-1 text-lg font-medium text-gray-900">{categoria.price}</p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Categorias