"use server";

import { get } from "http";
import Product from "../models/product.model";
import { connectToDatabase } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { revalidatePath } from "next/cache";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    connectToDatabase();
    const scrapeProduct = await scrapeAmazonProduct(productUrl);
    if (!scrapeProduct) return;

    let product = scrapeProduct;
    const existingProduct = await Product.findOne({ url: scrapeProduct.url });
    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapeProduct.currentPrice },
      ];
      product = {
        ...scrapeProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }
    const newProduct = await Product.findOneAndUpdate(
      {url: scrapeProduct.url},
      product,
      { new: true, upsert: true }
    )
    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Faild to create/update product: ${error.message}`);
  }
}
export async function getProductById(productId: string) {
  try {
    connectToDatabase()
    const product = await Product.findById({ _id: productId })
    if(!product) return;
    return product
  } catch (error) {
    console.log(error)
  }
}
export async function getAllProducts() {
  try {
    connectToDatabase()
    const products = await Product.find()
    if(!products) return;
    return products
  } catch (error) {
    console.log(error)
  }
}