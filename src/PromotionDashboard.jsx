import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setPromotions, updatePromotion } from "./redux/promotionsSlice";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Card, Grid2, Typography, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel, Select, MenuItem, Snackbar, Alert } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from 'dayjs';
import axios from "axios";

const API_URL = "https://backend-promotion-prmotoion-backend.azuremicroservices.io/promotions";

const PromotionDashboard = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const promotions = useSelector((state) => state.promotions.list);
    const [form, setForm] = useState({
        id: null,
        name: "",
        startDate: null,
        endDate: null,
        budget: "",
        salesImpact: ""
    });
    const [search, setSearch] = useState("");
    const [language, setLanguage] = useState("en");
    const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });


    const formatDate = (date) => new Date(date).toLocaleDateString()
    const formatInt = (value) => new String(value);

    //Setting language headers
    const headers = {
        "Accept-Language": language
    }

    const fetchPromotions = async () => {
        const response = await axios.get(API_URL);
        return response.data;
    };

    const sortedPromotions = [...promotions].sort((a, b) => {
        if (!a[sortConfig.key] || !b[sortConfig.key]) return 0;
        if (sortConfig.direction === "asc") {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        } else {
            return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
        }
    });

    const filteredPromotions = sortedPromotions.filter(promo => {
        const { name, startDate, endDate, budget, salesImpact } = promo;
        if (name?.includes(search) || formatDate(startDate)?.includes(search) || formatDate(endDate)?.includes(search) || formatInt(budget)?.includes(search) || formatInt(salesImpact).includes(search)) {
            return true;
        }
    }
    );

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
        }));
    };

    const { data } = useQuery("promotions", fetchPromotions, {
        onSuccess: (data) => dispatch(setPromotions(data)),
    });

    const addPromotionMutation = useMutation((newPromo) => axios.post(API_URL, newPromo, { headers }), {
        onSuccess: (response) => {
            showSnackbar(response.data.message);
            return queryClient.invalidateQueries("promotions")
        },
    });

    const updatePromotionMutation = (id, updatedPromo) => axios.put(`${API_URL}/${id}`, updatedPromo, { headers }).then((response) => {
        showSnackbar(response.data.message);
        dispatch(updatePromotion(updatedPromo))
    })

    const deletePromotionMutation = useMutation((id) => axios.delete(`${API_URL}/${id}`, { headers }), {
        onSuccess: (response) => {
            showSnackbar(response.data.message);
            return queryClient.invalidateQueries("promotions")
        },
    });

    const deletePromotion = (id) => {
        deletePromotionMutation.mutate(id);
    };

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleChangeLanguage = (value) => {
        i18n.changeLanguage(value);
        setLanguage(value);
    }
    const handleDateChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleEdit = (promo) => {
        setForm({
            ...promo,
            ["startDate"]: dayjs(promo.startDate),
            ["endDate"]: dayjs(promo.endDate),
        });
    };

    const addOrUpdatePromotion = () => {
        if (form.name && form.startDate && form.endDate && form.budget) {
            if (form.startDate < form.endDate) {
                if (form.id) {
                    updatePromotionMutation(form.id, form);
                } else {
                    addPromotionMutation.mutate(form);
                }
                setForm({ id: null, name: "", startDate: null, endDate: null, budget: "", salesImpact: "" });
            } else {
                alert(t("endDateValidation"));
            }
        } else {
            alert(t("fieldValidation"));
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <Card style={{ padding: "20px", marginBottom: "20px" }}>
                <Grid2 container justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" gutterBottom>{t("promotions")}</Typography>
                    <Select
                        value={i18n.language}
                        onChange={(e) => handleChangeLanguage(e.target.value)}
                    >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="fr">Français</MenuItem>
                    </Select>
                </Grid2>
                <Typography variant="h5" gutterBottom>{t("createPromotion")}</Typography>
                <TextField fullWidth margin="normal" label={t("promotionName")} name="name" value={form.name ?? ''} onChange={handleInputChange} required />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid2 container direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Grid2 item xs={6}>
                            <DatePicker label={t("startDate")} value={form.startDate} onChange={(date) => handleDateChange("startDate", date)} required />
                        </Grid2>
                        <Grid2 item xs={6}>
                            <DatePicker label={t("endDate")} value={form.endDate} onChange={(date) => handleDateChange("endDate", date)} required />

                        </Grid2>
                    </Grid2>
                </LocalizationProvider>
                <TextField fullWidth margin="normal" type="number" label={t("budget")} name="budget" value={form.budget ?? ''} onChange={handleInputChange} required />
                <TextField fullWidth margin="normal" type="number" label={t("expectedSalesImpact")} name="salesImpact" value={form.salesImpact ?? ''} onChange={handleInputChange} />
                <Button variant="contained" color="primary" onClick={addOrUpdatePromotion}>{form.id ? t("updatePromotion") : t("addPromotion")}</Button>
            </Card>
            
            <Card style={{ padding: "20px", marginBottom: "20px" }}>
                <Typography variant="h5" gutterBottom>{t("promotions")}</Typography>
                <TextField fullWidth margin="normal" label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel active={sortConfig.key === "name"} direction={sortConfig.direction} onClick={() => handleSort("name")}>
                                    {t("name")}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel active={sortConfig.key === "startDate"} direction={sortConfig.direction} onClick={() => handleSort("startDate")}>
                                    {t("startDate")}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel active={sortConfig.key === "endDate"} direction={sortConfig.direction} onClick={() => handleSort("endDate")}>
                                    {t("endDate")}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel active={sortConfig.key === "budget"} direction={sortConfig.direction} onClick={() => handleSort("budget")}>
                                    {t("budget")}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel active={sortConfig.key === "salesImpact"} direction={sortConfig.direction} onClick={() => handleSort("salesImpact")}>
                                    {t("salesImpact")}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>{t("actions")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPromotions.map((promo) => (
                            <TableRow key={promo.id}>
                                <TableCell>{promo.name}</TableCell>
                                <TableCell>{new Date(promo.startDate).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(promo.endDate).toLocaleDateString()}</TableCell>
                                <TableCell>${promo.budget}</TableCell>
                                <TableCell>{promo.salesImpact}</TableCell>
                                <TableCell>
                                    <Button color="primary" onClick={() => handleEdit(promo)}>{t("edit")}</Button>
                                    <Button color="secondary" onClick={() => deletePromotion(promo.id)}>{t("delete")}</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default PromotionDashboard;
