import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultLayout from "../../components/Layouts/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Financials {
  capital: number;
  expense: number;
  netProfit: number;
  totalInventoryCost: number;
  totalRevenue: number;
}

interface HealthCheck {
  id: string;
  date: Timestamp;
  checkType: string;
  result: string;
}

interface BreedingRecord {
  id: string;
  date: Timestamp;
  henId: string;
  roosterId: string;
  outcome: string;
}

interface EggCycleData {
  id: string;
  date: Timestamp;
  eggsLaid: number;
}

interface Medicine {
  id: string;
  date: Timestamp;
  name: string;
  dosage: string;
  cost: number;
}

const PoultryHealthMonitor: React.FC = () => {
  const [financials, setFinancials] = useState<Financials>({
    capital: 0,
    expense: 0,
    netProfit: 0,
    totalInventoryCost: 0,
    totalRevenue: 0,
  });
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [breedingRecords, setBreedingRecords] = useState<BreedingRecord[]>([]);
  const [eggCycleData, setEggCycleData] = useState<EggCycleData[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isHealthCheckDialogOpen, setIsHealthCheckDialogOpen] = useState(false);
  const [isBreedingRecordDialogOpen, setIsBreedingRecordDialogOpen] =
    useState(false);
  const [isEggCycleDialogOpen, setIsEggCycleDialogOpen] = useState(false);
  const [isMedicineDialogOpen, setIsMedicineDialogOpen] = useState(false);
  useEffect(() => {
    fetchFinancials();
    fetchHealthChecks();
    fetchBreedingRecords();
    fetchEggCycleData();
    fetchMedicines();
  }, []);

  const fetchFinancials = async () => {
    const docRef = doc(db, "hen-and-heaven", "gNfmJEedFjmg8g6I7vMO");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setFinancials(docSnap.data() as Financials);
    }
  };

  const fetchHealthChecks = async () => {
    const q = query(
      collection(db, "health-checks"),
      orderBy("date", "desc"),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    setHealthChecks(
      querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as HealthCheck[]
    );
  };

  const fetchBreedingRecords = async () => {
    const q = query(
      collection(db, "breeding-records"),
      orderBy("date", "desc"),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    setBreedingRecords(
      querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BreedingRecord[]
    );
  };

  const fetchEggCycleData = async () => {
    const q = query(
      collection(db, "egg-cycles"),
      orderBy("date", "desc"),
      limit(30)
    );
    const querySnapshot = await getDocs(q);
    setEggCycleData(
      querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as EggCycleData[]
    );
  };

  const fetchMedicines = async () => {
    const q = query(
      collection(db, "medicines"),
      orderBy("date", "desc"),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    setMedicines(
      querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Medicine[]
    );
  };

  const addHealthCheck = async (data: {
    checkType: string;
    result: string;
  }) => {
    try {
      await addDoc(collection(db, "health-checks"), {
        ...data,
        date: Timestamp.now(),
      });
      await fetchHealthChecks();
      toast.success("Health check added successfully!");
      setIsHealthCheckDialogOpen(false);
    } catch (error) {
      toast.error("Failed to add health check. Please try again.");
    }
  };

  const addBreedingRecord = async (data: {
    henId: string;
    roosterId: string;
    outcome: string;
  }) => {
    try {
      await addDoc(collection(db, "breeding-records"), {
        ...data,
        date: Timestamp.now(),
      });
      await fetchBreedingRecords();
      toast.success("Breeding record added successfully!");
      setIsBreedingRecordDialogOpen(false);
    } catch (error) {
      toast.error("Failed to add breeding record. Please try again.");
    }
  };

  const addEggCycleData = async (data: { eggsLaid: number }) => {
    try {
      await addDoc(collection(db, "egg-cycles"), {
        ...data,
        date: Timestamp.now(),
      });
      await fetchEggCycleData();
      toast.success("Egg cycle data added successfully!");
      setIsEggCycleDialogOpen(false);
    } catch (error) {
      toast.error("Failed to add egg cycle data. Please try again.");
    }
  };

  const addMedicine = async (data: {
    name: string;
    dosage: string;
    cost: number;
  }) => {
    try {
      await addDoc(collection(db, "medicines"), {
        ...data,
        date: Timestamp.now(),
      });

      // Update financials
      const newExpense = financials.expense + data.cost;
      const newNetProfit =
        financials.totalRevenue - newExpense - financials.totalInventoryCost;

      await updateDoc(doc(db, "hean-and-heaven", "gNfmJEedFjmg8g6I7vMO"), {
        expense: newExpense,
        netProfit: newNetProfit,
      });

      await fetchMedicines();
      await fetchFinancials();
      toast.success("Medicine added successfully!");
      setIsMedicineDialogOpen(false);
    } catch (error) {
      toast.error("Failed to add medicine. Please try again.");
    }
  };
  fetchMedicines();
  fetchFinancials();

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Health Monitoring" />
      <div className="rounded-sm border  border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Poultry Health Monitor</h1>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Financials</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Capital: ₹{financials.capital}</p>
                <p>Expense: ₹{financials.expense}</p>
                <p>Net Profit: ₹{financials.netProfit}</p>
                <p>Total Inventory Cost: ₹{financials.totalInventoryCost}</p>
                <p>Total Revenue: ₹{financials.totalRevenue}</p>
              </CardContent>
            </Card>
          </div> */}

          {/* Health Checks Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Health Checks</h2>
            <Dialog
              open={isHealthCheckDialogOpen}
              onOpenChange={setIsHealthCheckDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>Add Health Check</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Health Check</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    addHealthCheck(
                      Object.fromEntries(formData) as {
                        checkType: string;
                        result: string;
                      }
                    );
                  }}
                >
                  <Label htmlFor="checkType">Check Type</Label>
                  <Input id="checkType" name="checkType" required />
                  <Label htmlFor="result">Result</Label>
                  <Input id="result" name="result" required />
                  <Button type="submit">Add</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check Type</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {healthChecks.map((check) => (
                  <TableRow key={check.id}>
                    <TableCell>
                      {check.date.toDate().toLocaleDateString()}
                    </TableCell>
                    <TableCell>{check.checkType}</TableCell>
                    <TableCell>{check.result}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Breeding Records</h2>
            <Dialog
              open={isBreedingRecordDialogOpen}
              onOpenChange={setIsBreedingRecordDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>Add Breeding Record</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Breeding Record</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    addBreedingRecord(
                      Object.fromEntries(formData) as {
                        henId: string;
                        roosterId: string;
                        outcome: string;
                      }
                    );
                  }}
                >
                  <Label htmlFor="henId">Hen ID</Label>
                  <Input id="henId" name="henId" required />
                  <Label htmlFor="roosterId">Rooster ID</Label>
                  <Input id="roosterId" name="roosterId" required />
                  <Label htmlFor="outcome">Outcome</Label>
                  <Input id="outcome" name="outcome" required />
                  <Button type="submit">Add</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Hen ID</TableHead>
                  <TableHead>Rooster ID</TableHead>
                  <TableHead>Outcome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {breedingRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {record.date.toDate().toLocaleDateString()}
                    </TableCell>
                    <TableCell>{record.henId}</TableCell>
                    <TableCell>{record.roosterId}</TableCell>
                    <TableCell>{record.outcome}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Egg Cycle</h2>
            <Dialog
              open={isEggCycleDialogOpen}
              onOpenChange={setIsEggCycleDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>Add Egg Cycle Data</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Egg Cycle Data</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    addEggCycleData({
                      eggsLaid: parseInt(
                        formData.get("eggsLaid") as string,
                        10
                      ),
                    });
                  }}
                >
                  <Label htmlFor="eggsLaid">Eggs Laid</Label>
                  <Input id="eggsLaid" name="eggsLaid" type="number" required />
                  <Button type="submit">Add</Button>
                </form>
              </DialogContent>
            </Dialog>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={eggCycleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) =>
                    new Date(date.seconds * 1000).toLocaleDateString()
                  }
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="eggsLaid" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Medicines</h2>
            <Dialog
              open={isMedicineDialogOpen}
              onOpenChange={setIsMedicineDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>Add Medicine</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Medicine</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    addMedicine({
                      name: formData.get("name") as string,
                      dosage: formData.get("dosage") as string,
                      cost: parseFloat(formData.get("cost") as string),
                    });
                  }}
                >
                  <Label htmlFor="name">Medicine Name</Label>
                  <Input id="name" name="name" required />
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input id="dosage" name="dosage" required />
                  <Label htmlFor="cost">Cost</Label>
                  <Input
                    id="cost"
                    name="cost"
                    type="number"
                    step="0.01"
                    required
                  />
                  <Button type="submit">Add</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell>
                      {medicine.date.toDate().toLocaleDateString()}
                    </TableCell>
                    <TableCell>{medicine.name}</TableCell>
                    <TableCell>{medicine.dosage}</TableCell>
                    <TableCell>₹{medicine.cost}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </DefaultLayout>
  );
};

export default PoultryHealthMonitor;
