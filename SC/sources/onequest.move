module onequest::core { 
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
    use one::object::{Self, UID};
    use one::transfer;
    use one::tx_context::{Self, TxContext};
    use one::coin::{Self, Coin};
    use one::balance::{Self, Balance};
    use one::event;
    use one::clock::{Self, Clock};
    use one::oct::OCT;
    use std::string::String;

    // --- Objects & Structs ---

    public struct RelayerCap has key, store {
        id: UID,
    }
    public struct CampaignVault has key {
        id: UID,
        balance: Balance<OCT>,
    }
    public struct QuestBadge has key, store {
        id: UID,
        campaign_id: String,
        name: String,
        description: String,
    }

    // --- Events ---

    public struct CampaignCreatedEvent has copy, drop {
        admin: address,
        campaign_id: String,
        amount_paid: u64,
    }

    public struct QuestCompletedEvent has copy, drop {
        user: address,
        quest_id: String,
        timestamp: u64,
    }

    public struct BadgeMintedEvent has copy, drop {
        user: address,
        badge_id: address,
        campaign_id: String,
    }

    // --- Konstanta ---
        const CAMPAIGN_FEE: u64 = 500_000_000; // 0.5 OCT
        const E_INVALID_PAYMENT: u64 = 0;
    
    // --- Initialization ---

    fun init(ctx: &mut TxContext) {
        transfer::transfer(RelayerCap {
            id: object::new(ctx),
        }, tx_context::sender(ctx));
        transfer::share_object(CampaignVault {
            id: object::new(ctx),
            balance: balance::zero<OCT>(),
        });
    }

    // --- Core Functions ---

    public entry fun pay_and_create_campaign(
        vault: &mut CampaignVault,
        payment: Coin<OCT>,
        campaign_id: String,
        ctx: &mut TxContext
    ) {
        let amount_paid = coin::value(&payment);
        
        assert!(amount_paid == CAMPAIGN_FEE, E_INVALID_PAYMENT);
        
        coin::put(&mut vault.balance, payment);

        event::emit(CampaignCreatedEvent {
            admin: tx_context::sender(ctx),
            campaign_id,
            amount_paid,
        });
    }

    public entry fun record_completion_and_mint_nft(
        _: &RelayerCap,
        quest_id: String,
        campaign_id: String,
        badge_name: String,
        badge_desc: String,
        clock: &Clock,
        user: address,
        ctx: &mut TxContext
    ) {

        let timestamp = clock::timestamp_ms(clock);

        event::emit(QuestCompletedEvent {
            user,
            quest_id,
            timestamp,
        });

        let badge = QuestBadge {
            id: object::new(ctx),
            campaign_id,
            name: badge_name,
            description: badge_desc,
        };

        let badge_id = object::uid_to_address(&badge.id);

        event::emit(BadgeMintedEvent {
            user,
            badge_id,
            campaign_id,
        });


        transfer::public_transfer(badge, user);
    }

}