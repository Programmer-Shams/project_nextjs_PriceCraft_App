import { Product } from "@/types"
import Image from "next/image"
import Link from "next/link"

type Props = {
    product: Product
}
const ProductCard = ({product}:Props ) => {
  return (
    <Link href={`/products/${product._id}`} className="product-card">
        <div className="product-card_img-container">
            <Image src={product.image} alt={product.title} className="product-card_img" height={200} width={200}/>
            <div className="flex flex-col gap-3">
            <h3 className="product-title">{product.title}</h3>
            <div className="flex">

            </div>
            </div>
        </div>
    </Link>
  )
}

export default ProductCard