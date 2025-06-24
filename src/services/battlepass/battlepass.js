const {battlepass, profile_battlepass, battlepass_quest, profile_quest, quest, profile, sequelize} = require('../../models');
const { BaseError, NotFoundError, ConflictError } = require('../../common/responses/error-response');
const { StatusCodes } = require('http-status-codes');

/** 
 * Mengambil daftar battlepass yang tersedia
 * @returns {Promise<Array>} - Daftar battlepass yang tersedia
 * @throws {NotFoundError} - Jika tidak ada data battlepass yang ditemukan
 * @throws {BaseError} - Jika terjadi kesalahan saat mengambil data battlepass
 * 
 */

const getAvailableBattlepass = async () => {
    try {
        const battlepassesData = await battlepass.findAll({
            where: {
                status: 'in_season'
            },
        });

        if (!battlepassesData || battlepassesData.length === 0) {
            throw new NotFoundError(StatusCodes.NOT_FOUND, 'Battlepass tidak ditemukan');
        }

        return battlepassesData;
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}


/** 
 * Mengaktifkan battlepass untuk user tertentu
 * @param {string} user_id - ID pengguna yang ingin mengaktifkan battlepass
 * @param {string} battlepass_id - ID battlepass yang ingin diaktifkan
 * @returns {Promise<Object>} - Data profile_battlepass yang berhasil dibuat
 * @throws {NotFoundError} - Jika battlepass atau profile tidak ditemukan
 * @throws {ConflictError} - Jika profile sudah memiliki battlepass yang sama
 * @throws {BaseError} - Jika terjadi kesalahan saat mengaktifkan battlepass 
 */

const activateBattlepass = async (user_id, battlepass_id) => {
    const t = await sequelize.transaction();
    try {
        // Cek apakah battlepass tersedia
        const battlepassData = await battlepass.findOne({
            where: {
                id: battlepass_id,
                status: 'in_season'
            },
            transaction: t
        });

        if (!battlepassData) {
            throw new NotFoundError('Battlepass tidak ditemukan atau tidak tersedia');
        }

        //cek apakah profile user ada
        const profileData = await profile.findOne({
            where: {
                user_id: user_id
            },
            lock: t.LOCK.UPDATE,
            transaction: t
        });

        if (!profileData) {
            throw new NotFoundError('Profile tidak ditemukan');
        }
        const profile_id = profileData.id;

        // Cek apakah profile sudah memiliki battlepass yang sama
        const existingProfileBattlepass = await profile_battlepass.findOne({
            where: {
                profile_id: profile_id,
                battlepass_id: battlepass_id
            },
            transaction: t
        });

        if (existingProfileBattlepass) {
            throw new ConflictError('Profile sudah memiliki battlepass ini');
        }

        //cek apakah currency cukup untuk mengaktifkan battlepass
        if (profileData.game_currency < battlepassData.price) {
            throw new BaseError(StatusCodes.BAD_REQUEST, 'Game currency tidak cukup untuk mengaktifkan battlepass');
        }

        // Buat entri baru di profile_battlepass
        const newProfileBattlepass = await profile_battlepass.create({
            profile_id: profile_id,
            battlepass_id: battlepass_id,
            status: 'active'
        }, { transaction: t });

        // Ambil quest yang terkait dengan battlepass ini
        const battlepassQuests = await battlepass_quest.findAll({
            where: {
                battlepass_id: battlepass_id
            },
            transaction: t
        });

        // Buat entri di profile_quest untuk setiap quest yang terkait sebanyak 30 quest dari total quest yang ada secara acak
        const questIds = battlepassQuests.map(bq => bq.quest_id);
        const shuffledQuestIds = questIds.sort(() => 0.5 - Math.random()).slice(0, 30);
        const profileQuestPromises = shuffledQuestIds.map(questId => {
            return profile_quest.create({
                profile_id: profile_id,
                quest_id: questId,
                profile_battlepass_id: newProfileBattlepass.id,
                status: 'in_progress'
            }, { transaction: t });
        });
        await Promise.all(profileQuestPromises);
        // Kurangi game currency dari profile
        await profile.decrement('game_currency', {
            by: battlepassData.price,
            where: {
                id: profile_id
            },
            transaction: t
        });
        // Commit transaction
        await t.commit();
        return {
            message: 'Battlepass berhasil diaktifkan',
            profile_battlepass: newProfileBattlepass
        };
    } catch (error) {
        // Rollback transaction jika terjadi error
        await t.rollback();

        if (error instanceof NotFoundError || error instanceof ConflictError) {
            throw error;
        }
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

/** 
 * Mengambil quest yang user miliki pada battlepass aktif
 * @param {string} user_id - ID pengguna yang ingin mengambil quest
 * @return {Promise<Object>} - Data battlepass dan quest yang terkait
 * @throws {NotFoundError} - Jika profile atau battlepass tidak ditemukan
 * @throws {BaseError} - Jika terjadi kesalahan saat mengambil data quest
 */

const getActiveBattlepassQuests = async (user_id) => {
    try {
        // Ambil profile berdasarkan user_id
        const profileData = await profile.findOne({
            where: {
                user_id: user_id
            }
        });

        if (!profileData) {
            throw new NotFoundError('Profile tidak ditemukan');
        }

        // Ambil semua battlepass aktif untuk profile ini
        const activeBattlepass = await profile_battlepass.findAll({
            where: {
                profile_id: profileData.id,
                status: 'active'
            },
            include: [{
                model: battlepass,
                as: 'battlepass'
            }],
        });

        if (!activeBattlepass || activeBattlepass.length === 0) {
            throw new NotFoundError('Tidak ada battlepass aktif untuk profile ini');
        }

        // Ambil quest yang terkait dengan semua battlepass aktif
        const quests = await profile_quest.findAll({
            where: {
                profile_id: profileData.id,
                profile_battlepass_id: activeBattlepass.map(ab => ab.id),
                status: 'in_progress'
            },
            include: [{
                model: quest,
                as: 'quest'
            }],
        });
        

        return {
            battlepass: activeBattlepass.battlepass,
            quests: quests
        };
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

module.exports = {
    getAvailableBattlepass,
    activateBattlepass,
    getActiveBattlepassQuests
};
