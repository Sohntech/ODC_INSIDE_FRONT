"use client";

import { useState, useEffect } from 'react';
import { learnersAPI, referentialsAPI, promotionsAPI, attendanceAPI } from '@/lib/api';
import { Users, Book, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;
const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalLearners: 0,
    totalReferentials: 0,
    currentPromotion: "2025",
    currentMonth: MONTHS[new Date().getMonth()],
    // Attendance summary stats
    present: 0,
    late: 0,
    absent: 0,
  });
  const [selectedMonth, setSelectedMonth] = useState('This Month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Gender distribution data
  const [genderData, setGenderData] = useState([
    { name: 'Hommes', value: 65, color: '#0E8D7B' },
    { name: 'Femmes', value: 35, color: '#F7941D' },
  ]);

  // Monthly attendance data
  const [monthlyAttendanceData, setMonthlyAttendanceData] = useState([]);  // Initialize as empty array
  
  const [chartKey, setChartKey] = useState(Date.now());
  
  const [attendanceFilter, setAttendanceFilter] = useState('today');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch all required data in parallel
        const [learners, referentials, promotions, attendanceData, dailyStats] = await Promise.all([
          learnersAPI.getAllLearners().catch(err => {
            console.error('Error fetching learners:', err);
            return [];
          }),
          referentialsAPI.getAllReferentials().catch(err => {
            console.error('Error fetching referentials:', err);
            return [];
          }),
          promotionsAPI.getAllPromotions().catch(err => {
            console.error('Error fetching promotions:', err);
            return [];
          }),
          attendanceAPI.getYearlyStats(CURRENT_YEAR).catch(err => {
            console.error('Error fetching yearly stats:', err);
            return null;
          }),
          attendanceAPI.getDailyStats(new Date().toISOString().split('T')[0]).catch(err => {
            console.error('Error fetching daily stats:', err);
            return null;
          })
        ]);
        
        // Update stats
        if (learners && learners.length > 0) {
          setStats(prev => ({ 
            ...prev, 
            totalLearners: learners.length 
          }));
          
          // Calculate gender distribution
          const maleCount = learners.filter(learner => learner.gender === 'MALE').length;
          const femaleCount = learners.filter(learner => learner.gender === 'FEMALE').length;
          const total = learners.length || 1; // Avoid division by zero
          
          const malePercentage = Math.round((maleCount / total) * 100);
          const femalePercentage = 100 - malePercentage; // Ensure they add up to 100%
          
          setGenderData([
            { name: 'Hommes', value: malePercentage, color: '#0E8D7B' },
            { name: 'Femmes', value: femalePercentage, color: '#F7941D' },
          ]);
        }
        
        // Update referentials count
        if (referentials && referentials.length > 0) {
          setStats(prev => ({ 
            ...prev, 
            totalReferentials: referentials.length 
          }));
        }
        
        // Get current promotion
        if (promotions && promotions.length > 0) {
          const currentPromotion = promotions.find(p => p.status === 'ACTIVE')?.name || "2025";
          setStats(prev => ({ 
            ...prev, 
            currentPromotion 
          }));
        }
        
        // Update daily attendance stats
        if (dailyStats) {
          setStats(prev => ({
            ...prev,
            present: dailyStats.present , // 60-100
            late: dailyStats.late , // 5-20
            absent: dailyStats.absent , // 5-25
          }));
        } else {
          // Default stats if API fails
         
        }
        
        // Update attendance data
        if (attendanceData?.months) {
          const chartData = attendanceData.months.map((monthData, index) => ({
            name: MONTHS[index],
            Présence: monthData.present || 0,
            Retard: monthData.late || 0,
            Absences: monthData.absent || 0,
          }));
          
          // Make sure we're setting valid data
          if (chartData.some(data => data.Présence > 0 || data.Retard > 0 || data.Absences > 0)) {
            setMonthlyAttendanceData(chartData);
          } else {
            setMonthlyAttendanceData([]);
          }
        } else {
          setMonthlyAttendanceData([]);
        }
        
        // Force chart re-render
        setChartKey(Date.now());
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
        // Still render default data
        setMonthlyAttendanceData([]);
      }
    };

    fetchData();
  }, []);

  // Handle month selection change
  const handleMonthChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedMonth(value);
    setLoading(true);
    
    try {
      let chartData = [];
      
      if (value === 'This Month') {
        const monthStats = await attendanceAPI.getMonthlyStats(CURRENT_YEAR, CURRENT_MONTH);
        
        if (monthStats?.days?.length > 0) {
          chartData = monthStats.days.map((day) => ({
            name: `Jour ${day.date}`,
            Présence: day.present || 0,
            Retard: day.late || 0,
            Absences: day.absent || 0,
          }));
          
          // Only set data if we have valid values
          if (!chartData.every(data => 
            data.Présence === 0 && data.Retard === 0 && data.Absences === 0
          )) {
            setMonthlyAttendanceData(chartData);
          } else {
            setMonthlyAttendanceData([]);
          }
        }
      } else if (value === 'Last Month') {
        const lastMonth = CURRENT_MONTH === 1 ? 12 : CURRENT_MONTH - 1;
        const year = CURRENT_MONTH === 1 ? CURRENT_YEAR - 1 : CURRENT_YEAR;
        const monthStats = await attendanceAPI.getMonthlyStats(year, lastMonth).catch(() => null);
        
        if (monthStats?.days && monthStats.days.length > 0) {
          chartData = monthStats.days.map((day, index) => ({
            name: `Jour ${index + 1}`,
            Présence: day.present || 0,
            Retard: day.late || 0,
            Absences: day.absent || 0,
          }));
        } else {
          // Generate sample data for demonstration
          chartData = Array.from({ length: 30 }, (_, i) => ({
            name: `Jour ${i + 1}`,
            Présence: Math.floor(Math.random() * 50) + 30,
            Retard: Math.floor(Math.random() * 20) + 5,
            Absences: Math.floor(Math.random() * 10) + 5,
          }));
        }
      } else if (value === 'This Year') {
        const yearlyStats = await attendanceAPI.getYearlyStats(CURRENT_YEAR).catch(() => null);
        
        if (yearlyStats?.months && yearlyStats.months.length > 0) {
          chartData = yearlyStats.months.map((month, index) => ({
            name: MONTHS[index],
            Présence: month.present || 0,
            Retard: month.late || 0,
            Absences: month.absent || 0,
          }));
        } else {
          // Generate sample data for demonstration
          chartData = [];
        }
      }
      
      setMonthlyAttendanceData(chartData);
      
      // Force chart re-render
      setChartKey(Date.now());
    } catch (err) {
      console.error('Error fetching period data:', err);
      // In case of error, use default data
      setMonthlyAttendanceData([]);
      setChartKey(Date.now());
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceFilterChange = async (filter: string) => {
    setAttendanceFilter(filter);
    setLoading(true);

    try {
      let date = new Date();
      
      switch (filter) {
        case 'today':
          date = new Date();
          break;
        case 'yesterday':
          date = new Date(Date.now() - 86400000); // 24 hours ago
          break;
        case 'week':
          date = new Date(Date.now() - 7 * 86400000); // 7 days ago
          break;
        case 'month':
          date = new Date(date.getFullYear(), date.getMonth(), 1); // Start of month
          break;
      }

      const dailyStats = await attendanceAPI.getDailyStats(date.toISOString().split('T')[0]);
      
      if (dailyStats) {
        setStats(prev => ({
          ...prev,
          present: dailyStats.present || 0,
          late: dailyStats.late || 0,
          absent: dailyStats.absent || 0,
        }));
      }
    } catch (err) {
      console.error('Error fetching attendance stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="md:col-span-2 bg-orange-500 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-6 flex items-center justify-between">
            <div className="text-white">
              <div className="text-4xl font-bold">{loading ? '-' : stats.totalLearners}</div>
              <div className="text-sm mt-1">Apprenants</div>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="bg-orange-600 h-1"></div>
        </div>
        
        <div className="md:col-span-2 bg-orange-500 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 flex items-center justify-between">
            <div className="text-white">
              <div className="text-4xl font-bold">{loading ? '-' : stats.totalReferentials}</div>
              <div className="text-sm mt-1">Référentiels</div>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <Book className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="bg-orange-600 h-1"></div>
        </div>
        
        {/* Date Card */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-lg overflow-hidden border border-orange-100">
          <div className="p-4 flex flex-col items-center justify-center h-full">
            <div className="text-orange-500 font-bold text-3xl">{new Date().getDate()}</div>
            <div className="text-gray-600 font-medium">{stats.currentMonth} {CURRENT_YEAR}</div>
          </div>
          <div className="bg-orange-500 h-1"></div>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Statistiques de présence</h2>
          <div className="flex gap-2">
            <button
              onClick={() => handleAttendanceFilterChange('today')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                attendanceFilter === 'today'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Aujourd'hui
            </button>
            <button
              onClick={() => handleAttendanceFilterChange('yesterday')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                attendanceFilter === 'yesterday'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Hier
            </button>
            <button
              onClick={() => handleAttendanceFilterChange('week')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                attendanceFilter === 'week'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Cette semaine
            </button>
            <button
              onClick={() => handleAttendanceFilterChange('month')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                attendanceFilter === 'month'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Ce mois
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-teal-500 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 flex items-center justify-between">
              <div className="text-white">
                <div className="text-4xl font-bold">{loading ? '-' : stats.present}</div>
                <div className="text-sm mt-1">Présents</div>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="bg-teal-600 h-1"></div>
          </div>
          
          <div className="bg-yellow-400 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 flex items-center justify-between">
              <div className="text-white">
                <div className="text-4xl font-bold">{loading ? '-' : stats.late}</div>
                <div className="text-sm mt-1">En retard</div>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <Clock className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="bg-yellow-500 h-1"></div>
          </div>
          
          <div className="bg-red-400 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 flex items-center justify-between">
              <div className="text-white">
                <div className="text-4xl font-bold">{loading ? '-' : stats.absent}</div>
                <div className="text-sm mt-1">Absents</div>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="bg-red-500 h-1"></div>
          </div>
        </div>
      </div>

      {/* Sonatel Card and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sonatel Card */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex flex-col items-center">
            <div className="mb-6 relative h-16 w-full flex justify-center">
              <img 
                src="https://res.cloudinary.com/drxouwbms/image/upload/v1743507686/image_27_qtiin4.png" 
                alt="Sonatel Logo"
                className="h-full"
              />
            </div>
            <p className="text-gray-600 text-sm text-center mb-8">
              Transformer la vie des personnes grâce à nos solutions technologiques innovantes et accessibles.
            </p>
            <div className="grid grid-cols-3 w-full text-center gap-4">
              <div>
                <p className="text-xl font-bold">{loading ? '-' : stats.totalLearners}</p>
                <p className="text-xs text-gray-500">Apprenants</p>
              </div>
              <div>
                <p className="text-xl font-bold">{stats.currentPromotion}</p>
                <p className="text-xs text-gray-500">Promotion</p>
              </div>
              <div>
                <p className="text-xl font-bold">{stats.currentMonth}</p>
                <p className="text-xs text-gray-500">Mois</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Présences statistiques</h2>
            <select 
              className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="h-[300px] w-full" key={chartKey}>
              {monthlyAttendanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyAttendanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                    barSize={16}
                    barGap={2}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      height={40}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      width={40}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                      contentStyle={{ 
                        borderRadius: '4px',
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={36}
                      wrapperStyle={{ paddingBottom: "10px" }}
                      iconType="circle"
                    />
                    <Bar 
                      name="Présence" 
                      dataKey="Présence" 
                      fill="#0E8D7B" 
                      radius={[4, 4, 0, 0]} 
                      isAnimationActive={true}
                      animationDuration={1000}
                    />
                    <Bar 
                      name="Retard" 
                      dataKey="Retard" 
                      fill="#B4E1D8" 
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={true}
                      animationDuration={1000} 
                    />
                    <Bar 
                      name="Absences" 
                      dataKey="Absences" 
                      fill="#F7941D" 
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={true}
                      animationDuration={1000} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Aucune donnée disponible pour cette période
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Gender Distribution */}
      <div className="mt-6 bg-white rounded-lg p-6 shadow-lg">
        <div className="flex items-center mb-6">
          <div className="bg-orange-100 rounded-full p-2 mr-3">
            <Users className="h-6 w-6 text-orange-500" />
          </div>
          <h2 className="text-lg font-semibold">{loading ? '-' : stats.totalLearners} Apprenants</h2>
        </div>
        
        {loading ? (
          <div className="h-[200px] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="ml-8">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 rounded-full bg-[#0E8D7B] mr-2"></div>
                <span className="text-sm mr-4">Hommes</span>
                <span className="font-medium">{genderData[0].value}%</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#F7941D] mr-2"></div>
                <span className="text-sm mr-4">Femmes</span>
                <span className="font-medium">{genderData[1].value}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}