const updateCart = async function (req, res) {

    try {

        const userSaveId = req.loggedInUser.user
        const userId = req.params.userId

        if (userId) {

            if (!isValidObjectId(userId)) { return res.status(400).send({ message: "userId is InValid", status: false }) }

            if (userSaveId !== userId) { return res.status(403).send({ message: "user is not Authorised for this operation", status: false }) }

            const userData = await userModel.findOne({ _id: userId, isDeleted: false })

            if (!userData) {
                return res.status(404).send({ status: false, message: "No user register" })
            }

            let data = req.body
            let { productId, cartId, removeProduct } = data

            if (Object.keys(data).length == 0) {
                return res.status(400).send({ status: false, message: `Data required to update or remove form cart` })
            }

            if (!isValid(productId)) {
                return res.status(400).send({ status: false, message: `Please provide ProductId or Id: ${productId} should be valid` })
            }
            if (!isValidObjectId(productId)) {
                return res.status(400).send({ status: false, message: `ProductId : ${productId} should be valid` })
            }

            let findProduct = await productModel.findOne({ _id: productId })
            if (!findProduct) {
                return res.status(404).send({ status: false, message: `ProductId : ${productId} not existed in db` })
            }

            if (findProduct.isDeleted == true) {
                return res.status(404).send({ status: false, message: `This ProductId : ${productId} is already deleted` })
            }


            if (!isValid(cartId)) {
                return res.status(400).send({ status: false, message: `Please provide CartId or Id: ${cartId} should be valid` })
            }
            if (!isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: `CartId : ${cartId} should be valid` })
            }

            let findCart = await cartModel.findOne({ _id: cartId })
            console.log(findCart)
            if (!findCart) {
                return res.status(404).send({ status: false, message: `CartId : ${cartId} not existed ` })
            }

            if (findCart.items.length == 0) {
                return res.status(404).send({ status: false, message: `You have not added any product in this Cart : ${cartId}` })
            }

            if (!isValid(removeProduct)) {
                return res.status(400).send({ status: false, message: `RemoveProduct is required` })
            }
            if (!/^[0-1]$/.test(removeProduct)) {
                return res.status(400).send({ status: false, message: `RemoveProduct will be accepted only 0 or 1` })
            }

            let cart = findCart.items
            // console.log(cart)

            for (let i = 0; i < cart.length; i++) {
                if (cart[i].productId == productId) {
                    let updatePrice = cart[i].quantity * findProduct.price


                    // directly remove a product from the cart if quantity  is 0
                    if (removeProduct == 0) {
                        let productRemoved = await cartModel.findOneAndUpdate({ _id: cartId }, { $pull: { items: { productId: productId } }, totalPrice: findCart.totalPrice - updatePrice, totalItems: findCart.totalItems - 1 }, { new: true })
                        //    console.log(productRemoved)
                        return res.status(200).send({ status: true, message: `Product Removed Successfully`, data: productRemoved })
                    }

                    // remove the product if quantity is 1 or product is also 1
                    if (removeProduct == 1) {
                        if (cart[i].quantity == 1 && removeProduct == 1) {
                            let allRemovedProduct = await cartModel.findOneAndUpdate({ _id: cartId }, { $pull: { items: { productId: productId } }, totalPrice: findCart.totalPrice - updatePrice, totalItems: findCart.totalItems - 1 }, { new: true })
                            //    console.log(updatePrice)
                            return res.status(200).send({ status: true, message: `No Products available in this cart`, data: allRemovedProduct })
                        }
                        else {
                            //decrementing the quantity of a product by 1 
                            cart[i].quantity = cart[i].quantity - 1
                            let cartUpdate = await cartModel.findByIdAndUpdate({ _id: cartId }, { items: cart, totalPrice: findCart.totalPrice - findProduct.price }, { new: true })

                            return res.status(200).send({ status: true, message: 'One Product removed successfully', data: cartUpdate })
                        }
                    }
                }

            }

        }
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
