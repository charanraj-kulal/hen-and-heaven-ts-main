import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";

const DashboardWrapper: React.FC = () => {
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.startsWith("/dashboard")) {
      checkTodayCollection();
    }
  }, [location]);

  const checkTodayCollection = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDoc = await getDocs(
      query(
        collection(db, "egg-collections"),
        where("date", "==", Timestamp.fromDate(today))
      )
    );
    if (todayDoc.empty) {
      setShowReminderDialog(true);
    }
  };

  const handleAddNow = () => {
    setShowReminderDialog(false);
    navigate("/dashboard/egg-collections");
  };

  return (
    <>
      <Outlet />
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Egg Collection Reminder</DialogTitle>
          </DialogHeader>
          <p>You haven't added today's egg collection yet.</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowReminderDialog(false)}
            >
              I'll add later
            </Button>
            <Button onClick={handleAddNow}>Add now</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardWrapper;
