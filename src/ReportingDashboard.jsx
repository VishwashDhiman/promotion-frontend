import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Card, Typography, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useTranslation } from "react-i18next";

const ReportingPage = () => {
  const { t } = useTranslation();
  const promotions = useSelector((state) => state.promotions.list);
  const [filterDates, setFilterDates] = useState({ start: null, end: null });

  const filteredPromotions = promotions.filter(promo => {
    if (!filterDates.start || !filterDates.end) return true;
    return new Date(promo.startDate) >= new Date(filterDates.start) && new Date(promo.endDate) <= new Date(filterDates.end);
  });

  const totalBudget = filteredPromotions.reduce((acc, promo) => acc + Number(promo.budget), 0);
  const avgSalesImpact = filteredPromotions.reduce((acc, promo) => acc + (Number(promo.salesImpact) || 0), 0) / filteredPromotions.length || 0;

  return (
    <div style={{ padding: "20px" }}>
      <Card style={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h5" gutterBottom>{t('reports')}</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label={t('startDate')} value={filterDates.start} onChange={(date) => setFilterDates({ ...filterDates, start: date })} />
          <DatePicker label={t('endDate')} value={filterDates.end} onChange={(date) => setFilterDates({ ...filterDates, end: date })} />
        </LocalizationProvider>
        <Button variant="contained" color="primary" style={{ margin: "10px" }} onClick={() => setFilterDates({ start: null, end: null })}>{t('resetFilter')}</Button>
        <Typography m={2}>{t('totalPromotions')}: {filteredPromotions.length}</Typography>
        <Typography m={2}>{t('totalBudget')}: ${totalBudget}</Typography>
        <Typography m={2}>{t('averageSalesImpact')}: {avgSalesImpact.toFixed(2)}</Typography>
      </Card>


    </div>
  );
};

export default ReportingPage;
