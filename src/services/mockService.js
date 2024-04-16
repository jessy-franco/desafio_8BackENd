import {faker} from '@faker-js/faker';


// Genera productos falsos usando Faker.js
export function generateProducts(quantity) {
    const products = [];
    for (let i = 0; i < quantity; i++) {
        const product = {
            id: faker.database.mongodbObjectId(),
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            stock: faker.string.numeric({ min: 1, max: 100 }),
            image:faker.image.urlPicsumPhotos(400, 400),
            description: faker.lorem.sentence(),
            
        };
        products.push(product);
    }
    return products;

}

