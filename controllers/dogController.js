const dogService = require("../services/dogService");
const formatToKST = require("../utils/formatDate");

const addMyDog = async (req, res) => {
  try {
    const userId = req.user._id;
    const newDog = await dogService.createDog(userId, req.body);

    // 시간 변환
    const formattedDog = {
      ...newDog.toJSON(),
      birthday: formatToKST(newDog.birthday),
      firstMetAt: formatToKST(newDog.firstMetAt),
    };

    res.status(201).json({
      message: "강아지 등록 완료",
      dog: formattedDog,
    });
  } catch (error) {
    console.error("강아지 등록 실패:", error);
    res.status(400).json({
      message: error.message || "강아지 추가 중 예기치 않은 오류 발생",
    });
  }
};

const getMyDogSummary = async (req, res) => {
  try {
    const dog = await dogService.getDogByUserId(req.user._id);

    if (!dog) {
      return res.status(404).json({ message: "등록된 강아지가 없습니다." });
    }

    res.status(200).json({
      name: dog.name,
      photo: dog.photo,
      togetherFor: dog.togetherFor,
    });
  } catch (error) {
    console.error("강아지 간단 조회 실패:", error);
    res.status(500).json({ message: "강아지 정보 조회 중 예기치 않은 오류 발생" });
  }
};

const getMyDogDetail = async (req, res) => {
  try {
    const userId = req.user._id;
    const dog = await dogService.getDogByUserId(userId);

    if (!dog) {
      return res.status(404).json({ message: "등록된 강아지가 없습니다." });
    }

    const formattedDog = {
      ...dog.toJSON(),
      birthday: formatToKST(dog.birthday),
      firstMetAt: formatToKST(dog.firstMetAt),
    };

    res.status(200).json({
      message: "강아지 조회 성공",
      dog: formattedDog,
    });
  } catch (error) {
    console.error("강아지 조회 실패:", error);
    res.status(500).json({ message: "강아지 조회 중 예기치 않은 오류 발생" });
  }
};

const updateMyDog = async (req, res) => {
  try {
    const userId = req.user._id;
    const updatedDog = await dogService.updateDog(userId, req.body);

    if (!updatedDog) {
      return res.status(404).json({ message: "등록된 강아지가 없습니다." });
    }

    const formattedDog = {
      ...updatedDog.toJSON(),
      birthday: formatToKST(updatedDog.birthday),
      firstMetAt: formatToKST(updatedDog.firstMetAt),
      createdAt: formatToKST(updatedDog.createdAt),
      updatedAt: formatToKST(updatedDog.updatedAt),
    };

    res.status(200).json({
      message: "강아지 수정 완료",
      dog: formattedDog,
    });
  } catch (error) {
    console.error("강아지 수정 실패:", error);
    res.status(500).json({ message: "강아지 수정 중 예기치 않은 오류 발생" });
  }
};

const deleteMyDog = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await dogService.deleteDogByUser(userId);

    if (!result) {
      return res.status(404).json({ message: "삭제할 강아지 정보가 없습니다." });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error("강아지 삭제 실패:", error);
    res.status(500).json({ message: "강아지 삭제 중 예기치 않은 오류 발생" });
  }
};

module.exports = {
  addMyDog,
  getMyDogSummary,
  getMyDogDetail,
  updateMyDog,
  deleteMyDog,
};
