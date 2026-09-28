'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  HiOutlineSparkles,
  HiOutlineTrendingUp,
  HiOutlineExclamation,
  HiOutlineCheckCircle,
  HiOutlineRefresh,
  HiOutlineChartBar,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineCurrencyDollar,
  HiOutlineShieldCheck
} from 'react-icons/hi';

interface Item {
  id: number;
  name: string;
  code: string;
  quantity: number;
  place?: { name: string; cupboard?: { name: string } };
}

interface PredictionResult {
  status: string;
  model_name: string;
  predicted_units_sold: number;
  current_inventory: number;
  recommended_reorder_quantity: number;
  stockout_risk: string;
  dynamic_metrics?: ModelMetric[];
  note?: string;
  inputs_processed?: {
    category: string;
    price: number;
    discount: number;
    inventory_level: number;
    seasonality: string;
    weather_condition: string;
    holiday_promotion: string;
  };
}

interface ModelMetric {
  model: string;
  mae: number;
  rmse: number;
  mape: number;
  status: string;
}

export default function AIForecastPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  
  // Prediction Form State
  const [category, setCategory] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [inventoryLevel, setInventoryLevel] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [discount, setDiscount] = useState<number | ''>('');
  const [seasonality, setSeasonality] = useState<string>('');
  const [weatherCondition, setWeatherCondition] = useState<string>('');
  const [holidayPromotion, setHolidayPromotion] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [metrics, setMetrics] = useState<ModelMetric[]>([]);

  useEffect(() => {
    fetchItems();
    fetchMetrics();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/items');
      setItems(res.data);
    } catch (e) {
      console.error('Failed to fetch items:', e);
    }
  };

  const fetchMetrics = async () => {
    try {
      const res = await api.get('/ai/metrics');
      if (res.data?.metrics_table) {
        setMetrics(res.data.metrics_table);
      }
    } catch (e) {
      console.error('Failed to fetch AI metrics:', e);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItemId(id);
    const item = items.find((i) => i.id.toString() === id);
    if (item) {
      setInventoryLevel(item.quantity);
    }
  };

  const handlePredict = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const numPrice = Number(price) || 0;
      const numDiscount = Number(discount) || 0;
      const numInventory = Number(inventoryLevel) || 0;

      const res = await api.post('/ai/predict', {
        category,
        region,
        inventory_level: numInventory,
        price: numPrice,
        discount: numDiscount,
        seasonality,
        weather_condition: weatherCondition,
        holiday_promotion: holidayPromotion,
        units_ordered: 15,
        competitor_pricing: numPrice * 1.05,
      });

      setResult(res.data);

      if (res.data?.dynamic_metrics) {
        setMetrics(res.data.dynamic_metrics);
      }
    } catch (err) {
      console.error('Prediction API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL_STOCKOUT_RISK':
        return <span className="badge damaged"><HiOutlineExclamation /> Critical Stockout Warning</span>;
      case 'HIGH_RISK':
        return <span className="badge borrowed"><HiOutlineExclamation /> High Stockout Risk</span>;
      case 'OVERSTOCKED':
        return <span className="badge staff">Overstocked</span>;
      default:
        return <span className="badge in-store"><HiOutlineCheckCircle /> Optimal Stock Level</span>;
    }
  };

  return (
    <div>
      <div className="page-header flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <HiOutlineSparkles /> Machine Learning Intelligence
          </div>
          <h2>AI Demand Forecast & Analytics</h2>
          <p>Powered by <span className="text-emerald-400 font-semibold">{result?.model_name || 'Linear Regression'} Demand Model</span></p>
        </div>
      </div>

      {/* Main Grid: Form Left, Prediction Cards Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Prediction Input Form */}
        <div className="lg:col-span-6 glass-card p-6">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <HiOutlineChartBar className="text-emerald-400" /> Forecast Parameters
            </h3>
            {items.length > 0 && (
              <select
                value={selectedItemId}
                onChange={(e) => handleSelectItem(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-emerald-500"
              >
                <option value="">Auto-fill from Item...</option>
                {items.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name} ({i.quantity} in stock)
                  </option>
                ))}
              </select>
            )}
          </div>

          <form onSubmit={handlePredict} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label text-xs">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Select Category...</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Supplies">Supplies</option>
                  <option value="Tools">Tools</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Medical">Medical</option>
                </select>
              </div>

              <div>
                <label className="form-label text-xs">Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Select Region...</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="Central">Central</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="form-label text-xs">Current Stock</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 30"
                  value={inventoryLevel}
                  onChange={(e) => setInventoryLevel(e.target.value === '' ? '' : Number(e.target.value))}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label text-xs">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 49.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label text-xs">Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 10"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="form-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="form-label text-xs">Seasonality</label>
                <select
                  value={seasonality}
                  onChange={(e) => setSeasonality(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Select...</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                  <option value="Spring">Spring</option>
                  <option value="Autumn">Autumn</option>
                </select>
              </div>

              <div>
                <label className="form-label text-xs">Weather</label>
                <select
                  value={weatherCondition}
                  onChange={(e) => setWeatherCondition(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Select...</option>
                  <option value="Sunny">Sunny</option>
                  <option value="Rainy">Rainy</option>
                  <option value="Cold">Cold</option>
                  <option value="Stormy">Stormy</option>
                </select>
              </div>

              <div>
                <label className="form-label text-xs">Promotion</label>
                <select
                  value={holidayPromotion}
                  onChange={(e) => setHolidayPromotion(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Select...</option>
                  <option value="None">None</option>
                  <option value="Black Friday">Black Friday</option>
                  <option value="Christmas">Christmas</option>
                  <option value="Back to School">Back to School</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center mt-2"
              style={{ padding: '12px' }}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Computing Prediction...</span>
                </div>
              ) : (
                <>
                  <HiOutlineSparkles className="text-lg" /> Run AI Demand Forecast
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results Cards */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <>
              {/* Primary Prediction Banner */}
              <div className="glass-card p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-emerald-500/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                    Predicted Demand ({seasonality || 'Selected Season'})
                  </span>
                  {getRiskBadge(result.stockout_risk)}
                </div>

                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-5xl font-extrabold text-emerald-400">
                    {result.predicted_units_sold}
                  </span>
                  <span className="text-slate-400 font-medium text-sm">Units Sold Expected</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Current Inventory</div>
                    <div className="text-2xl font-bold text-slate-200">{result.current_inventory} units</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Recommended Reorder</div>
                    <div className="text-2xl font-bold text-emerald-400">
                      +{result.recommended_reorder_quantity} units
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Details */}
              <div className="glass-card p-5">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-slate-300">
                  <HiOutlineShieldCheck className="text-emerald-400" /> AI Inventory Recommendation
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {result.recommended_reorder_quantity > 0 ? (
                    `Based on current trends, pricing ($${price}), and expected ${seasonality.toLowerCase()} demand, your inventory level of ${result.current_inventory} is lower than predicted demand (${result.predicted_units_sold}). We recommend placing an order for +${result.recommended_reorder_quantity} units to avoid stockout.`
                  ) : (
                    `Your current stock level of ${result.current_inventory} units is sufficient to meet the expected demand of ${result.predicted_units_sold} units. No immediate reordering is required.`
                  )}
                </p>
              </div>
            </>
          ) : (
            <div className="glass-card p-8 text-center flex flex-col items-center justify-center min-h-[340px]">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400 text-2xl">
                <HiOutlineSparkles />
              </div>
              <h4 className="text-base font-bold text-slate-200 mb-1">Ready for Prediction</h4>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Fill out the parameters on the left or select an item to auto-fill, then click <strong className="text-emerald-400">Run AI Demand Forecast</strong> to generate real-time AI predictions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Model Benchmark Performance Table */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <HiOutlineTrendingUp className="text-emerald-400" /> AI Model Evaluation Benchmarks
            </h3>
            <p className="text-xs text-slate-400 mt-1">Comparative evaluation metrics from thesis interim report</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
            Dataset: Retail SME Demand
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Model Architecture</th>
                <th>Mean Absolute Error (MAE)</th>
                <th>Root Mean Squared Error (RMSE)</th>
                <th>MAPE (%)</th>
                <th>Evaluation Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics && metrics.length > 0 ? (
                metrics.map((m: any, idx) => {
                  const modelName = m?.model || m?.['Model Architecture'] || m?.Model || `Model ${idx + 1}`;
                  const statusName = m?.status || m?.Status || m?.['Evaluation Status'] || '';
                  const isSelected = statusName.toLowerCase().includes('best') || modelName.toLowerCase().includes('linear');
                  
                  const getVal = (...keys: string[]) => {
                    let raw: any = undefined;
                    for (const k of keys) {
                      if (m?.[k] !== undefined && m?.[k] !== null) {
                        raw = m[k];
                        break;
                      }
                    }
                    if (raw === undefined || raw === null) return '--';
                    const num = Number(raw);
                    return !isNaN(num) ? num.toFixed(2) : String(raw);
                  };

                  return (
                    <tr key={idx} className={isSelected ? 'bg-emerald-500/10 border-l-4 border-l-emerald-500' : ''}>
                      <td style={{ fontWeight: 600, color: isSelected ? '#34d399' : '#f1f5f9' }}>
                        {modelName}
                      </td>
                      <td className="font-mono text-slate-300">{getVal('mae', 'MAE', 'Mean Absolute Error (MAE)')}</td>
                      <td className="font-mono text-slate-300">{getVal('rmse', 'RMSE', 'Root Mean Squared Error (RMSE)')}</td>
                      <td className="font-mono text-slate-300">{getVal('mape', 'MAPE', 'MAPE (%)', 'mape_pct')}%</td>
                      <td>
                        <span className={`badge ${isSelected ? 'in-store' : 'staff'}`}>
                          {statusName || (isSelected ? 'Selected Best Fit' : 'Benchmark Candidate')}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-slate-400">
                    No metrics available. Please run an AI forecast query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
