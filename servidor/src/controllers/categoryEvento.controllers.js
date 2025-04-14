const categoryEventCTRL = {};

const CategoryEvento = require('../models/CategoryEvento');

categoryEventCTRL.deleteOne = async (req, res) => {

    try {

        const { id } = req.params;

        const deleteCategory = await CategoryEvento.findByIdAndDelete(id);

        if (!deleteCategory) return res.status(400).json({
            ok: false,
            msg: 'No se encontro esa categoria'
        });

        res.status(200).json({
            ok: true,
            deleteCategory
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'no se puedo eliminar la categoria, hable con el adminstrador'
        })
    }

};

categoryEventCTRL.getAll = async (req, res) => {

    try {
        const categoriaEventos = await CategoryEvento.find();

        res.status(200).json({
            ok: true,
            categoriaEventos
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al traer las categorias de eventos, hable con el administrador'
        })
    }

};

categoryEventCTRL.patchOne = async (req, res) => {

    const { id } = req.params;

    console.log(id);
    try {

        const updateCategoria = await CategoryEvento.findOneAndUpdate({ _id: id }, req.body, { new: true });

        if (!updateCategoria) return res.status(400).json({
            ok: false,
            msg: 'No se encontro esa categoria'
        })

        res.status(200).json({
            ok: true,
            updateCategoria
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar una categoria de evento, hable con el administrador'
        })
    }


};

categoryEventCTRL.postOne = async (req, res) => {
    try {
        const { nombre, color } = req.body;

        const categoria = await CategoryEvento.findOne({ nombre });
        if (categoria) return res.status(400).json({
            ok: false,
            msg: 'Ya existe una categoria con ese gasto'
        })

        const category = new CategoryEvento({ nombre, color });

        await category.save();

        res.status(201).json({
            ok: true,
            category
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al cargar Categoria de evento, hable con el administrador',
        })
    }




};



module.exports = categoryEventCTRL;