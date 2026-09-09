import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useUserAuth from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import PollCard from '../../components/PollCards/PollCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import CREATE_ICON from '../../assets/images/auth-card-3.png';
import EmptyCard from '../../components/cards/EmptyCard';

const PAGE_SIZE = 10;

const Bookmarks = () => {
  useUserAuth();
  const navigate = useNavigate();

  const [bookmarkedPolls, setBookmarkedPolls] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchAllPolls = async (overridePage = page) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.GET_BOOKMARKED}?page=${overridePage}&limit=${PAGE_SIZE}`
      );

      const newPolls = response.data?.bookmarkedPolls || [];

      if (newPolls.length > 0) {
        setBookmarkedPolls((prevPolls) => {
          if (overridePage === 1) return newPolls;
          const existingIds = new Set(prevPolls.map((p) => p._id));
          const uniquePolls = newPolls.filter((p) => !existingIds.has(p._id));
          return [...prevPolls, ...uniquePolls];
        });
        setHasMore(newPolls.length === PAGE_SIZE);
      } else {
        if (overridePage === 1) setBookmarkedPolls([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPolls(page);
  }, [page]);

  const loadMorePolls = () => {
    setPage((prev) => prev + 1);
  };

  const handleBookmarkToggle = (pollId) => {
    setBookmarkedPolls((prev) => prev.filter((p) => p._id !== pollId));
  };

  return (
    <DashboardLayout activeMenu="Bookmarks">
      <div className="my-5 mx-auto max-w-4xl">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Saved Bookmarks</h2>

        {bookmarkedPolls.length === 0 && !loading && (
          <EmptyCard
            imgsrc={CREATE_ICON}
            message="You haven't bookmarked any polls yet! Tap the bookmark icon on any poll to save it for later."
            btnText="Explore Polls"
            onClick={() => navigate("/dashboard")}
          />
        )}

        <InfiniteScroll
          dataLength={bookmarkedPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className="info-text my-4">Loading bookmarks...</h4>}
          endMessage={
            bookmarkedPolls.length > 0 ? (
              <p className="info-text my-6">All bookmarked polls are displayed.</p>
            ) : null
          }
        >
          {bookmarkedPolls.map((poll) => (
            <PollCard
              key={`bookmark_${poll._id}`}
              pollId={poll._id}
              question={poll.question}
              type={poll.type}
              options={poll.options}
              voters={poll.voters?.length || 0}
              responses={poll.response || poll.responses || []}
              creatorProfileImg={poll.creator?.profileImageUrl || null}
              creatorName={poll.creator?.fullName || poll.creator?.username || "Anonymous"}
              creatorUsername={poll.creator?.username || ""}
              userHasVoted={poll.userHasVoted || false}
              isPollClosed={poll.closed || false}
              createdAt={poll.createdAt || ""}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
};

export default Bookmarks;