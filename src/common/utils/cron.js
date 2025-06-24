const cron = require('node-cron');
const { battlepass, profile_quest, profile_battlepass, sequelize } = require('../../models');
const { Op } = require('sequelize');

/**
 * update status battlepass apabila sudah mencapai end date
 * @returns {Promise<void>}
 */
const updateBattlepassStatus = async () => {
    const t = await sequelize.transaction();
    try {
        const currentDate = new Date();

        //hitung jumlah battlepass yang sudah berakhir
        const expiredBattlepassCount = await battlepass.count({
            where: {
                end_date: {
                    [Op.lte]: currentDate
                },
                status: 'in_season'
            },
            transaction: t
        });

        if (expiredBattlepassCount === 0) {
            console.log('Tidak ada battlepass yang perlu diupdate');
            await t.commit();
            return {
                success: true,
                message: 'Tidak ada battlepass yang perlu diupdate',
                data: {
                    expiredBattlepassCount: 0,
                    updatedBattlepassCount: 0,
                    updatedProfileBattlepassCount: 0,
                    updatedProfileQuestCount: 0
                }
            }
        }

        // Update status battlepass yang sudah berakhir
        const battlepasses = await battlepass.findAll({
            where: {
                end_date: {
                    [Op.lte]: currentDate
                },
                status: 'in_season'
            },
            transaction: t
        });

        if (battlepasses.length > 0) {
            await Promise.all(battlepasses.map(async (bp) => {
                await bp.update({ status: 'ended' }, { transaction: t });
            }));
        }

        // Update profile_battlepass status to 'expired' for all profiles with ended battlepass
        const profileBattlepasses = await profile_battlepass.findAll({
            where: {
                battlepass_id: battlepasses.map(bp => bp.id),
                status: 'active'
            },
            transaction: t
        });
        if (profileBattlepasses.length > 0) {
            await Promise.all(profileBattlepasses.map(async (pbp) => {
                await pbp.update({ status: 'expired' }, { transaction: t });
            }));
        }

        // Update status quest dari setiap profile_quest yang terkait dengan battlepass yang sudah berakhir
        const profileQuests = await profile_quest.findAll({
            where: {
                status: 'in_progress',
            },
            include: [{
                model: profile_battlepass,
                as: 'profile_battlepass',
                where: {
                    battlepass_id: battlepasses.map(bp => bp.id),
                }
            }],
            transaction: t
        });
        if (profileQuests.length > 0) {
            await Promise.all(profileQuests.map(async (pq) => {
                await pq.update({ status: 'expired' }, { transaction: t });
            }));
        }

        //hitung jumlah battlepass yang sudah diupdate
        const updatedBattlepassCount = await battlepass.count({
            where: {
                end_date: {
                    [Op.lte]: currentDate
                },
                status: 'ended'
            },
            transaction: t
        });

        const updatedProfileBattlepassCount = await profile_battlepass.count({
            where: {
                battlepass_id: battlepasses.map(bp => bp.id),
                status: 'expired'
            },
            transaction: t
        });

        const updatedProfileQuestCount = await profile_quest.count({
            where: {
                status: 'expired',
                profile_battlepass_id: profileBattlepasses.map(pbp => pbp.id)
            },
            transaction: t
        });

        await t.commit();

        return {
            success: true,
            message: `${expiredBattlepassCount} battlepass(s) updated to 'ended' status`,
            data: {
                expiredBattlepassCount,
                updatedBattlepassCount,
                updatedProfileBattlepassCount,
                updatedProfileQuestCount
            }
        };

    } catch (error) {
        await t.rollback();
        throw error;
    }
}

//cron job untuk update status battlepass setiap hari pada pukul 00:00
const scheduleBattlepassUpdate = () => {
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log('Running daily battlepass status update check...');
            const result = await updateBattlepassStatus();
            console.log({
                message: 'Battlepass status updated successfully',
                data: result.data
            });
        } catch (error) {
            console.error('Error updating battlepass status:', error);
        }
    });
}

//test setiap 10 detik 
const testCron = () => {
    cron.schedule('*/10 * * * * *', async () => {
        try {
            const result = await updateBattlepassStatus();
            console.log({
                message: 'Battlepass status updated successfully',
                data: result.data
            });

        } catch (error) {
            console.error('Error updating battlepass status:', error);
        }
    });
}

module.exports = {
    scheduleBattlepassUpdate,
    testCron,
};