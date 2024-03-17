// export const revalidate = 0;

import { products } from "@/utilis/products";
import Container from "./components/Container";
import HomeBannner from "./components/nav/HomeBanner";
import { truncateText } from "@/utilis/truncateText";
import ProductCard from "./components/products/ProductCard";
import getProducts, { IproductParams } from "@/actions/getProduct";
import NullData from "./components/NullData";

interface HomeProps {
  searchParams: IproductParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const products = await getProducts(searchParams);  

  if (products?.length === 0) {
    return <NullData title='Oops! No products found. Click "All" to clear filters' />;
  }

  function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // function shuffle(array: any) {
  //   for (let i = array.length - 1; i > 0; i--) {
  //     let j = Math.floor(Math.random() * (i + 1));
  //     let temp = array[i];
  //     array[i] = array[j];
  //     array[j] = temp;
  //   }
  //   return array;
  // }
  // const shuffleProducts = shuffle(products);

  const shuffleProducts = shuffleArray(products);

  return (
    <div>
      <Container>
        <div>
          <HomeBannner />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {shuffleProducts?.map((product: any) => {
            return <ProductCard key={product.id} data={product} />;
          })}
        </div>
      </Container>
    </div>
  );
}
