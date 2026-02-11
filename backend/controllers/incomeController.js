const Income = require("../models/incomeModel");

exports.addIncome = async (req, res) => {
    try{
        const { amount,category, date, description } = req.body;
        const income = new Income({
            user: req.user.userId,
            amount,
            category,
            date,
            description
        });
        await income.save();
        res.status(201).json(income);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.getIncomes = async (req, res) => {
    try{
        const incomes = await Income.find({user: req.user.userId}).sort({ date: -1 });
        res.json(incomes);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateIncome = async(req, res) =>{
    try{
        const income = await Income.findOneAndUpdate(
            {_id: req.params.id, user: req.user.userId},
            req.body,
            {new: true}
        );
        if(!income) return res.status(404).json({ message: "Income not found" });
        res.json(income);
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.deleteIncome = async(req, res) =>{
    try{
        const income = await Income.findOneAndDelete({_id: req.params.id, user: req.user.userId});
        if(!income) 
            return res.status(404).json({ message: "Income not found" });
            res.json({ message: "Income deleted" });
        }catch(error){
            console.error(error);
            res.status(500).json({ message: error.message });
        }
};



