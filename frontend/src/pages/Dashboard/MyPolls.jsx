import React, { useEffect, useState, useContext } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useUserAuth from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import HeaderWithFilter from '../../components/layout/HeaderWithFilter';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import PollCard from '../../components/PollCards/PollCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { UserContext } from '../../context/UserContext';
import EmptyCard from '../../components/cards/EmptyCard';
import CREATE_ICON from '../../assets/images/auth-card-3.png';

const PAGE_SIZE = 10;

const MyPolls = () => {
  useUserAuth();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [allPolls, setAllPolls] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("");

  const fetchAllPolls = async (overridePage = page) => {
    if (loading || !user?._id) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}&creatorId=${user._id}`
      );

      const pollsList = response.data?.polls || [];

      if (pollsList.length > 0) {
        setAllPolls((prevPolls) => {
          if (overridePage === 1) return pollsList;
          const existingIds = new Set(prevPolls.map((p) => p._id));
          const newUnique = pollsList.filter((p) => !existingIds.has(p._id));
          return [...prevPolls, ...newUnique];
        });

        setHasMore(pollsList.length === PAGE_SIZE);
      } else {
        if (overridePage === 1) setAllPolls([]);
        setHasMore(false);
      }
    } catch (error) {
      // Handled silently
    } finally {
      setLoading(false);
    }
  };

  const loadMorePolls = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (user?._id) {
      setPage(1);
      fetchAllPolls(1);
    }
  }, [filterType, user?._id]);

  useEffect(() => {
    if (page !== 1 && user?._id) {
      fetchAllPolls(page);
    }
  }, [page]);

  const handleDeletePollLocally = (deletedPollId) => {
    setAllPolls((prev) => prev.filter((p) => p._id !== deletedPollId));
  };

  return (
    <DashboardLayout activeMenu="My Polls">
      <div className="my-5 mx-auto max-w-4xl">
        <HeaderWithFilter
          title="My Created Polls"
          filterType={filterType}
          setFilterType={setFilterType}
        />

        {allPolls.length === 0 && !loading && (
          <EmptyCard
            imgsrc={CREATE_ICON}
            message="You haven't created any polls yet! Tap below to publish your first poll."
            btnText="Create Poll"
            onClick={() => navigate("/create-poll")}
          />
        )}

        <InfiniteScroll
          dataLength={allPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className="info-text my-4">Loading your polls...</h4>}
          endMessage={
            allPolls.length > 0 ? (
              <p className="info-text my-6">All your created polls are loaded.</p>
            ) : null
          }
        >
          {allPolls.map((poll) => (
            <PollCard
              key={`mypoll_${poll._id}`}
              pollId={poll._id}
              question={poll.question}
              type={poll.type}
              options={poll.options}
              voters={poll.voters?.length || 0}
              responses={poll.response || poll.responses || []}
              creatorProfileImg={poll.creator?.profileImageUrl || null}
              creatorName={poll.creator?.fullName || user?.fullName || "You"}
              creatorUsername={poll.creator?.username || user?.username || ""}
              userHasVoted={poll.userHasVoted || false}
              isPollClosed={poll.closed || false}
              createdAt={poll.createdAt || ""}
              isMyPoll
              onDelete={() => handleDeletePollLocally(poll._id)}
            />
          ))}
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
};

export default MyPolls;